import { useEffect, useMemo, useRef, useState } from 'react';
import { ConnectionState, Room, RoomEvent, Track } from 'livekit-client';
import api from '../api';

const PHASES = {
  idle: 'idle',
  connecting: 'connecting',
  listening: 'listening',
  processing: 'processing',
  speaking: 'speaking',
  error: 'error',
};

function buildRoomName(languageCode) {
  const suffix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `civicease-voice__${languageCode || 'en-IN'}__${suffix}`;
}

function buildParticipantName(displayName) {
  return displayName?.trim() || 'Guest User';
}

function upsertTranscript(previous, nextEntry) {
  const index = previous.findIndex((entry) => entry.id === nextEntry.id);
  if (index === -1) {
    return [...previous, nextEntry].sort((left, right) => left.timestamp - right.timestamp);
  }

  const updated = [...previous];
  updated[index] = {
    ...updated[index],
    ...nextEntry,
    final: updated[index].final || nextEntry.final,
  };
  return updated.sort((left, right) => left.timestamp - right.timestamp);
}

export function useLivekitVoiceAssistant({ selectedLanguageCode, displayName }) {
  const [room, setRoom] = useState(null);
  const [phase, setPhase] = useState(PHASES.idle);
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [agentConnected, setAgentConnected] = useState(false);
  const [connectionState, setConnectionState] = useState(ConnectionState.Disconnected);

  const roomRef = useRef(null);
  const isMutedRef = useRef(false);
  const awaitingAgentRef = useRef(false);
  const localWasSpeakingRef = useRef(false);
  const remoteWasSpeakingRef = useRef(false);

  const sessionIdentity = useMemo(
    () => ({
      participantName: buildParticipantName(displayName),
      roomName: buildRoomName(selectedLanguageCode),
    }),
    [displayName, selectedLanguageCode]
  );

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    return () => {
      if (roomRef.current) {
        void roomRef.current.disconnect();
      }
    };
  }, []);

  async function disconnectRoom(targetRoom = roomRef.current) {
    if (!targetRoom) return;
    try {
      await targetRoom.disconnect();
    } catch {
      // Best effort disconnect only.
    }
  }

  async function startSession() {
    if (roomRef.current || phase === PHASES.connecting) return;

    setError('');
    setTranscript([]);
    setAgentConnected(false);
    setIsMuted(false);
    setPhase(PHASES.connecting);
    awaitingAgentRef.current = false;
    localWasSpeakingRef.current = false;
    remoteWasSpeakingRef.current = false;

    try {
      const tokenResponse = await api.get('/v1/voice/token', {
        params: {
          room_name: sessionIdentity.roomName,
          participant_name: sessionIdentity.participantName,
        },
      });

      const nextRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      nextRoom
        .on(RoomEvent.ConnectionStateChanged, (nextState) => {
          setConnectionState(nextState);
          if (nextState === ConnectionState.Disconnected) {
            setPhase(PHASES.idle);
            setAgentConnected(false);
          }
        })
        .on(RoomEvent.ParticipantConnected, (participant) => {
          if (participant.identity !== nextRoom.localParticipant.identity) {
            setAgentConnected(true);
          }
        })
        .on(RoomEvent.ParticipantDisconnected, (participant) => {
          if (participant.identity !== nextRoom.localParticipant.identity) {
            setAgentConnected(false);
          }
        })
        .on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
          const localIdentity = nextRoom.localParticipant.identity;
          const localIsSpeaking = speakers.some((speaker) => speaker.identity === localIdentity);
          const remoteIsSpeaking = speakers.some((speaker) => speaker.identity !== localIdentity);

          if (remoteIsSpeaking) {
            awaitingAgentRef.current = false;
            remoteWasSpeakingRef.current = true;
            setPhase(PHASES.speaking);
          } else if (localIsSpeaking) {
            awaitingAgentRef.current = false;
            localWasSpeakingRef.current = true;
            setPhase(PHASES.listening);
          } else if (localWasSpeakingRef.current) {
            awaitingAgentRef.current = true;
            localWasSpeakingRef.current = false;
            setPhase(PHASES.processing);
          } else if (remoteWasSpeakingRef.current) {
            remoteWasSpeakingRef.current = false;
            setPhase(isMutedRef.current ? PHASES.processing : PHASES.listening);
          } else if (awaitingAgentRef.current) {
            setPhase(PHASES.processing);
          } else if (!isMutedRef.current && nextRoom.state === ConnectionState.Connected) {
            setPhase(PHASES.listening);
          }
        })
        .on(RoomEvent.TrackSubscribed, (_track, publication, participant) => {
          if (
            publication.kind === Track.Kind.Audio &&
            participant.identity !== nextRoom.localParticipant.identity
          ) {
            setAgentConnected(true);
          }
        })
        .on(RoomEvent.TranscriptionReceived, (segments, participant) => {
          const isUser = participant?.identity === nextRoom.localParticipant.identity;
          segments.forEach((segment) => {
            const text = segment.text?.trim();
            if (!text) return;

            setTranscript((previous) =>
              upsertTranscript(previous, {
                id: segment.id,
                speaker: isUser ? 'user' : 'assistant',
                text,
                final: Boolean(segment.final),
                timestamp:
                  typeof segment.firstReceivedTime === 'number'
                    ? segment.firstReceivedTime
                    : Date.now(),
              })
            );
          });
        });

      roomRef.current = nextRoom;
      setRoom(nextRoom);

      await nextRoom.prepareConnection(tokenResponse.data.server_url, tokenResponse.data.token);
      await nextRoom.connect(tokenResponse.data.server_url, tokenResponse.data.token);
      await nextRoom.localParticipant.setMicrophoneEnabled(true);
      await nextRoom.startAudio();

      setPhase(PHASES.listening);
      setConnectionState(ConnectionState.Connected);
    } catch (caughtError) {
      await disconnectRoom(roomRef.current);
      roomRef.current = null;
      setRoom(null);
      setConnectionState(ConnectionState.Disconnected);
      setPhase(PHASES.error);
      setAgentConnected(false);
      setError(
        caughtError?.response?.data?.detail ||
          caughtError?.message ||
          'Unable to start the LiveKit voice assistant session.'
      );
    }
  }

  async function toggleMute() {
    if (!roomRef.current) return;

    const nextMuted = !isMuted;
    try {
      await roomRef.current.localParticipant.setMicrophoneEnabled(!nextMuted);
      setIsMuted(nextMuted);
      if (nextMuted) {
        setPhase(PHASES.processing);
      } else if (roomRef.current.state === ConnectionState.Connected) {
        setPhase(PHASES.listening);
      }
    } catch (caughtError) {
      setError(caughtError?.message || 'Unable to change microphone state.');
    }
  }

  async function endSession() {
    await disconnectRoom(roomRef.current);
    roomRef.current = null;
    setRoom(null);
    setConnectionState(ConnectionState.Disconnected);
    setPhase(PHASES.idle);
    setIsMuted(false);
    setAgentConnected(false);
    setTranscript([]);
    setError('');
    awaitingAgentRef.current = false;
    localWasSpeakingRef.current = false;
    remoteWasSpeakingRef.current = false;
  }

  const statusText = useMemo(() => {
    switch (phase) {
      case PHASES.connecting:
        return 'Connecting to the CivicEase voice room...';
      case PHASES.listening:
        return isMuted ? 'Microphone muted.' : 'The complaint assistant is listening.';
      case PHASES.processing:
        return 'The assistant is preparing a response...';
      case PHASES.speaking:
        return 'The assistant is speaking...';
      case PHASES.error:
        return error || 'Connection issue.';
      default:
        return 'Start a LiveKit complaint session from the controls below.';
    }
  }, [error, isMuted, phase]);

  return {
    room,
    phase,
    transcript,
    error,
    isMuted,
    isConnected: connectionState === ConnectionState.Connected,
    isStarting: phase === PHASES.connecting,
    agentConnected,
    sessionIdentity,
    statusText,
    startSession,
    toggleMute,
    endSession,
  };
}

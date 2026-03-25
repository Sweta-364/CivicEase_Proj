import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { RoomAudioRenderer } from '@livekit/components-react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Mic,
  MicOff,
  PhoneOff,
  Play,
  SendHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/useAuth';
import LivekitVoiceOrb from '../../components/assistant/LivekitVoiceOrb';
import { civicVoiceAssistant, voiceLanguages } from '../../lib/livekitVoiceConfig';
import { useLivekitVoiceAssistant } from '../../hooks/useLivekitVoiceAssistant';

const card = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';
const AUTO_CAPTURE_SECONDS = 3;
const CAMERA_POSITIONING_SECONDS = 4;
const EVIDENCE_TRIGGER_KEYWORDS = [
  'image evidence',
  'i need image evidence',
  'capture the photo here',
  'image as evidence',
  'evidence photo',
  'photo evidence',
];

function titleFromText(text) {
  const base = text.replace(/\s+/g, ' ').trim().replace(/[.?!]+$/, '');
  if (!base) return '';
  const cleaned = base.replace(/^(there is|there's|i want to report|please report|i am reporting)\s+/i, '');
  const words = cleaned.split(' ').filter(Boolean).slice(0, 8).join(' ');
  if (!words) return '';
  const title = words.charAt(0).toUpperCase() + words.slice(1);
  return title.length > 80 ? `${title.slice(0, 77)}...` : title;
}

function assistantAskedForEvidence(text) {
  const normalized = text.toLowerCase();
  if (!normalized) return false;
  return EVIDENCE_TRIGGER_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function getThankYouMessage(languageCode) {
  switch (languageCode) {
    case 'hi-IN':
      return 'धन्यवाद। आपकी शिकायत सफलतापूर्वक जमा हो गई है।';
    case 'mr-IN':
      return 'धन्यवाद. तुमची तक्रार यशस्वीपणे नोंदवली गेली आहे.';
    case 'od-IN':
      return 'ଧନ୍ୟବାଦ। ଆପଣଙ୍କ ଅଭିଯୋଗ ସଫଳତାର ସହିତ ଦାଖଲ ହୋଇଛି।';
    default:
      return 'Thank you. Your complaint has been submitted successfully.';
  }
}

export default function AssistantPage() {
  const navigate = useNavigate();
  const { appUser, firebaseUser } = useAuth();
  const displayName = appUser?.name || firebaseUser?.displayName || firebaseUser?.email || 'Citizen';
  const [selectedLanguageCode, setSelectedLanguageCode] = useState('en-IN');
  const [draft, setDraft] = useState({ title: '', description: '' });
  const [draftTouched, setDraftTouched] = useState({ title: false, description: false });
  const [photo, setPhoto] = useState(null);
  const [cameraState, setCameraState] = useState('idle');
  const [cameraError, setCameraError] = useState('');
  const [cameraCountdown, setCameraCountdown] = useState(AUTO_CAPTURE_SECONDS);
  const [evidenceRequested, setEvidenceRequested] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [issueId, setIssueId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const captureTimerRef = useRef(null);
  const autoSubmitRef = useRef(false);
  const publishedThankYouRef = useRef(false);

  const {
    room,
    phase,
    transcript,
    error,
    isMuted,
    isConnected,
    isStarting,
    statusText,
    startSession,
    toggleMute,
    endSession,
  } = useLivekitVoiceAssistant({
    selectedLanguageCode,
    displayName,
  });

  const userTranscript = useMemo(
    () =>
      transcript
        .filter((entry) => entry.speaker === 'user' && entry.final !== false)
        .map((entry) => entry.text.trim())
        .filter(Boolean)
        .join('\n'),
    [transcript]
  );

  const assistantTranscript = useMemo(
    () =>
      transcript
        .filter((entry) => entry.speaker === 'assistant' && entry.final !== false)
        .map((entry) => entry.text.trim())
        .filter(Boolean)
        .join('\n'),
    [transcript]
  );

  useEffect(() => {
    if (!draftTouched.description) {
      setDraft((previous) => ({ ...previous, description: userTranscript }));
    }
    if (!draftTouched.title) {
      setDraft((previous) => ({ ...previous, title: titleFromText(userTranscript) }));
    }
  }, [draftTouched.description, draftTouched.title, userTranscript]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (captureTimerRef.current) {
        window.clearInterval(captureTimerRef.current);
      }
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (
      !['positioning', 'countdown', 'capturing'].includes(cameraState) ||
      !videoRef.current ||
      !cameraStreamRef.current
    ) {
      return;
    }

    const videoElement = videoRef.current;
    videoElement.srcObject = cameraStreamRef.current;
    void videoElement.play().catch(() => {
      setCameraError('The camera preview could not start. Please retry.');
      setCameraState('blocked');
    });
  }, [cameraState]);

  useEffect(() => {
    if (issueId || photo || evidenceRequested) {
      return;
    }

    if (assistantAskedForEvidence(assistantTranscript)) {
      setEvidenceRequested(true);
    }
  }, [assistantTranscript, evidenceRequested, issueId, photo]);

  useEffect(() => {
    if (!evidenceRequested || photo || issueId || submitting) {
      return;
    }

    if (cameraState === 'idle') {
      void openEvidenceCamera();
    }
  }, [cameraState, evidenceRequested, issueId, photo, submitting]);

  useEffect(() => {
    if (!photo || !evidenceRequested || issueId || submitting) {
      return;
    }
    if (cameraState !== 'submitting') {
      return;
    }
    if (!draft.title.trim() || !draft.description.trim()) {
      return;
    }
    if (autoSubmitRef.current) {
      return;
    }

    autoSubmitRef.current = true;
    void submitComplaint({ autoTriggered: true });
  }, [cameraState, draft.description, draft.title, evidenceRequested, issueId, photo, submitting]);

  function stopCameraStream() {
    if (captureTimerRef.current) {
      window.clearInterval(captureTimerRef.current);
      captureTimerRef.current = null;
    }

    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function resetAssistantFlow() {
    stopCameraStream();
    autoSubmitRef.current = false;
    publishedThankYouRef.current = false;
    setDraft({ title: '', description: '' });
    setDraftTouched({ title: false, description: false });
    setPhoto(null);
    setCameraState('idle');
    setCameraError('');
    setCameraCountdown(AUTO_CAPTURE_SECONDS);
    setEvidenceRequested(false);
    setSubmissionError('');
    setIssueId(null);
  }

  async function handleStartSession() {
    resetAssistantFlow();
    await startSession();
  }

  async function handleEndSession() {
    stopCameraStream();
    autoSubmitRef.current = false;
    setCameraState('idle');
    setCameraCountdown(AUTO_CAPTURE_SECONDS);
    await endSession();
  }

  async function publishSubmissionThankYou(nextIssueId) {
    const message = getThankYouMessage(selectedLanguageCode);

    try {
      if (room?.localParticipant) {
        await room.localParticipant.publishData(
          new TextEncoder().encode(
            JSON.stringify({
              type: 'complaint_submitted',
              issue_id: nextIssueId,
              message,
            })
          ),
          {
            reliable: true,
            topic: 'civicease-assistant',
          }
        );
        publishedThankYouRef.current = true;
        return;
      }
    } catch {
      // Fallback below.
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = selectedLanguageCode;
      window.speechSynthesis.speak(utterance);
      publishedThankYouRef.current = true;
    }
  }

  async function openEvidenceCamera() {
    if (['requesting', 'positioning', 'countdown', 'capturing', 'submitting'].includes(cameraState)) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('This browser does not support direct camera access for automatic evidence capture.');
      setCameraState('blocked');
      return;
    }

    stopCameraStream();
    setCameraError('');
    setSubmissionError('');
    setCameraCountdown(AUTO_CAPTURE_SECONDS);
    setCameraState('requesting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      cameraStreamRef.current = stream;
      beginPositioningCountdown();
    } catch (caughtError) {
      stopCameraStream();
      setCameraState('blocked');
      setCameraError(
        caughtError?.message ||
          'Camera access was blocked. Please allow the camera and retry the evidence step.'
      );
    }
  }

  function beginPositioningCountdown() {
    if (captureTimerRef.current) {
      window.clearInterval(captureTimerRef.current);
    }

    setCameraState('positioning');
    setCameraCountdown(CAMERA_POSITIONING_SECONDS);

    captureTimerRef.current = window.setInterval(() => {
      setCameraCountdown((previous) => {
        if (previous <= 1) {
          if (captureTimerRef.current) {
            window.clearInterval(captureTimerRef.current);
            captureTimerRef.current = null;
          }
          beginCaptureCountdown();
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
  }

  function beginCaptureCountdown() {
    if (captureTimerRef.current) {
      window.clearInterval(captureTimerRef.current);
    }

    setCameraState('countdown');
    setCameraCountdown(AUTO_CAPTURE_SECONDS);

    captureTimerRef.current = window.setInterval(() => {
      setCameraCountdown((previous) => {
        if (previous <= 1) {
          if (captureTimerRef.current) {
            window.clearInterval(captureTimerRef.current);
            captureTimerRef.current = null;
          }
          void captureEvidencePhoto();
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
  }

  async function captureEvidencePhoto() {
    if (!videoRef.current || !cameraStreamRef.current) {
      setCameraError('Camera preview is not ready yet.');
      setCameraState('blocked');
      return;
    }

    const videoElement = videoRef.current;
    const width = videoElement.videoWidth || 1280;
    const height = videoElement.videoHeight || 720;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      setCameraError('Unable to capture the camera frame.');
      setCameraState('blocked');
      return;
    }

    setCameraState('capturing');
    context.drawImage(videoElement, 0, 0, width, height);

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.92);
    });

    if (!blob) {
      setCameraError('The image capture failed. Please retry the camera step.');
      setCameraState('blocked');
      return;
    }

    stopCameraStream();
    setCameraState('submitting');
    setPhoto(
      new File([blob], `civicease-evidence-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      })
    );
    setCameraCountdown(0);
  }

  async function getLocationIfAvailable() {
    if (!navigator.geolocation) return null;
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 15000,
          enableHighAccuracy: true,
        });
      });
      return { lat: position.coords.latitude, lng: position.coords.longitude };
    } catch {
      return null;
    }
  }

  async function submitComplaint({ autoTriggered = false } = {}) {
    if (!draft.title.trim() || !draft.description.trim()) {
      setSubmissionError('The complaint details are still being prepared. Please wait a moment and retry.');
      setCameraState('blocked');
      autoSubmitRef.current = false;
      return;
    }
    if (!photo) {
      setSubmissionError('Evidence photo is still missing. The camera step needs to finish before submission.');
      setCameraState('blocked');
      autoSubmitRef.current = false;
      return;
    }

    setSubmitting(true);
    setSubmissionError('');
    if (autoTriggered) {
      setCameraState('submitting');
    }

    try {
      const uploadMeta = await api.post('/v1/issues/images/upload-url', { file_name: photo.name });
      if (uploadMeta.data?.signed_upload_url) {
        await axios.put(uploadMeta.data.signed_upload_url, photo, {
          headers: { 'Content-Type': photo.type || 'application/octet-stream' },
        });
      }

      const response = await api.post('/v1/issues', {
        title: draft.title.trim(),
        description: draft.description.trim(),
        location: await getLocationIfAvailable(),
        photo_key: uploadMeta.data.photo_key,
      });

      setCameraState('idle');
      setIssueId(response.data.id);
      if (!publishedThankYouRef.current) {
        await publishSubmissionThankYou(response.data.id);
      }
    } catch (caughtError) {
      console.error(caughtError);
      autoSubmitRef.current = false;
      setCameraState('blocked');
      setSubmissionError(
        caughtError?.response?.data?.detail ||
          caughtError?.message ||
          'Failed to submit the complaint from the voice assistant.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSuccessDone() {
    await handleEndSession();
    resetAssistantFlow();
  }

  async function handleOpenIssueDetails() {
    const nextIssueId = issueId;
    await handleEndSession();
    resetAssistantFlow();
    navigate(`/home/issues/${nextIssueId}`);
  }

  const showCameraModal =
    ['requesting', 'positioning', 'countdown', 'capturing', 'submitting', 'blocked'].includes(cameraState) &&
    !issueId;

  const showSuccessModal = Boolean(issueId);

  return (
    <>
      <div className="space-y-6">
        <div className="max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">LiveKit Voice Agent</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">CivicEase Complaint Assistant</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Start the voice session, briefly describe the issue, and when the assistant asks for image evidence we will open the camera popup, capture the photo here, and submit the complaint.
          </p>
        </div>

        <div className="max-w-6xl">
          <section className={`${card} space-y-5`}>
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-white to-sky-50 p-5 ring-1 ring-black/5">
                <LivekitVoiceOrb
                  phase={phase}
                  statusText={statusText}
                  doctorImage={civicVoiceAssistant.image}
                  doctorName={civicVoiceAssistant.name}
                />

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={handleStartSession}
                    disabled={isConnected || isStarting}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    <Play className="h-4 w-4" />
                    {isStarting ? 'Starting...' : 'Start'}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    disabled={!isConnected}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {isMuted ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    {isMuted ? 'Unmute' : 'Mute'}
                  </button>

                  <button
                    type="button"
                    onClick={handleEndSession}
                    disabled={!isConnected && !isStarting}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                  >
                    <PhoneOff className="h-4 w-4" />
                    End
                  </button>
                </div>

                {error ? (
                  <div className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-100">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>{error}</p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Assistant Setup</p>
                  <h2 className="text-lg font-bold tracking-tight text-gray-900">Language</h2>

                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Conversation Language
                    </label>
                    <select
                      value={selectedLanguageCode}
                      onChange={(event) => setSelectedLanguageCode(event.target.value)}
                      disabled={isConnected || isStarting}
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50"
                    >
                      {voiceLanguages.map((language) => (
                        <option key={language.code} value={language.code}>
                          {language.label} ({language.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {showCameraModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Popup Capture</p>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Evidence Camera</h2>

            <div className="mt-5 space-y-4">
              {cameraState === 'requesting' ? (
                <div className="rounded-3xl bg-sky-50 p-5 text-sm text-sky-800 ring-1 ring-sky-100">
                  Opening the camera. Allow permission if the browser asks.
                </div>
              ) : cameraState === 'submitting' ? (
                <div className="rounded-3xl bg-sky-50 p-5 text-sm text-sky-800 ring-1 ring-sky-100">
                  Photo captured successfully. Submitting the complaint now...
                </div>
              ) : cameraState === 'blocked' ? (
                <div className="rounded-3xl bg-amber-50 p-5 text-sm text-amber-800 ring-1 ring-amber-100">
                  {cameraError || submissionError || 'The evidence step could not continue.'}
                </div>
              ) : (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className="h-72 w-full rounded-3xl object-cover ring-1 ring-black/5"
                />
              )}

              {cameraState === 'positioning' ? (
                <div className="rounded-3xl bg-sky-50 p-5 text-center text-sm text-sky-800 ring-1 ring-sky-100">
                  Move the camera to the proper position. The timer starts in {cameraCountdown} second{cameraCountdown === 1 ? '' : 's'}.
                </div>
              ) : null}

              {cameraState === 'countdown' ? (
                <div className="rounded-3xl bg-sky-50 p-5 text-center text-sm text-sky-800 ring-1 ring-sky-100">
                  Hold still. Capturing in {cameraCountdown} second{cameraCountdown === 1 ? '' : 's'}.
                </div>
              ) : null}

              {cameraState === 'capturing' ? (
                <div className="rounded-3xl bg-sky-50 p-5 text-center text-sm text-sky-800 ring-1 ring-sky-100">
                  Capturing the evidence photo...
                </div>
              ) : null}

              {cameraState === 'blocked' ? (
                <div className="flex flex-wrap gap-3">
                  {!photo ? (
                    <button
                      type="button"
                      onClick={openEvidenceCamera}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500"
                    >
                      <Camera className="h-4 w-4" />
                      Retry Camera
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => submitComplaint()}
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50"
                    >
                      <SendHorizontal className="h-4 w-4" />
                      {submitting ? 'Submitting...' : 'Retry Submit'}
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {showSuccessModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-600" />
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Submitted</p>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    Complaint Submitted Successfully
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Your complaint has been submitted as issue #{issueId}.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleOpenIssueDetails}
                    className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
                  >
                    Open Issue Details
                  </button>

                  <button
                    type="button"
                    onClick={handleSuccessDone}
                    className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {room ? <RoomAudioRenderer room={room} /> : null}
    </>
  );
}

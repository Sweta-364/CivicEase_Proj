import { Mic, MicOff, PhoneOff, Play } from 'lucide-react';
import LivekitTranscript from '../../components/assistant/LivekitTranscript';
import LivekitVoiceOrb from '../../components/assistant/LivekitVoiceOrb';
import { useAuth } from '../../context/useAuth';
import { useLivekitVoiceAssistant } from '../../hooks/useLivekitVoiceAssistant';

export default function AssistantPage() {
  const { appUser } = useAuth();
  const {
    phase,
    transcript,
    error,
    isMuted,
    isConnected,
    isStarting,
    agentConnected,
    statusText,
    startSession,
    toggleMute,
    endSession,
  } = useLivekitVoiceAssistant({
    selectedLanguageCode: 'en-IN',
    displayName: appUser?.display_name || appUser?.email,
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">AI Voice</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Voice Assistant</h1>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div className="flex flex-col items-center gap-6">
          <LivekitVoiceOrb
            phase={phase}
            statusText={statusText}
            doctorName="CivicEase Assistant"
          />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={startSession}
              disabled={isStarting || isConnected}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              {isStarting ? 'Connecting...' : isConnected ? 'Session Live' : 'Start Session'}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              disabled={!isConnected}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 ring-1 ring-black/5 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </button>

            <button
              type="button"
              onClick={endSession}
              disabled={!isConnected && !isStarting}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PhoneOff className="h-4 w-4" />
              End Session
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className={`rounded-full px-3 py-1 ${isConnected ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
              {isConnected ? 'Room Connected' : 'Disconnected'}
            </span>
            <span className={`rounded-full px-3 py-1 ${agentConnected ? 'bg-sky-50 text-sky-700' : 'bg-gray-100 text-gray-600'}`}>
              {agentConnected ? 'Agent Online' : 'Agent Offline'}
            </span>
          </div>

          {error ? (
            <div className="w-full max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}
        </div>
      </section>

      <LivekitTranscript items={transcript} />
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  AlertCircle,
  ImagePlus,
  LoaderCircle,
  MapPin,
  MessagesSquare,
  Plus,
  SendHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { auth } from '../../firebaseConfig';

const card = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';
const STORAGE_KEY = 'civicease_chatbot_session_id';
const CHATBOT_STREAM_URL = `${import.meta.env.VITE_API_URL || ''}/v1/chatbot/message/stream`;
const ISSUE_REFRESH_KEY = 'civicease_issue_refresh_token';

function formatTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function draftLine(label, value) {
  return (
    <div className="rounded-2xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 text-sm text-gray-700">{value || 'Not added yet'}</p>
    </div>
  );
}

function formatToolName(tool) {
  return (tool || 'tool')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function upsertToolEvent(previousEvents, nextEvent) {
  const current = Array.isArray(previousEvents) ? previousEvents : [];
  const existingIndex = current.findIndex((item) => item.stream_id === nextEvent.stream_id);
  if (existingIndex === -1) {
    return [...current, nextEvent];
  }

  const updated = [...current];
  updated[existingIndex] = {
    ...updated[existingIndex],
    ...nextEvent,
  };
  return updated;
}

function buildContextOnlyMessage(photoCount, hasLocation) {
  const parts = [];
  if (photoCount) {
    parts.push(`Shared ${photoCount} photo evidence item${photoCount === 1 ? '' : 's'}.`);
  }
  if (hasLocation) {
    parts.push('Shared current location.');
  }
  return parts.join(' ') || 'Shared complaint context.';
}

export default function ChatbotPage() {
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [pendingFiles, setPendingFiles] = useState([]);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [sending, setSending] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState('');

  function notifyIssueCreated(issueId) {
    if (!issueId) return;
    window.localStorage.setItem(ISSUE_REFRESH_KEY, `${issueId}:${Date.now()}`);
  }

  useEffect(() => {
    void bootstrapSession();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  async function bootstrapSession() {
    setLoadingSession(true);
    setError('');
    const storedSessionId = window.localStorage.getItem(STORAGE_KEY);

    try {
      if (storedSessionId) {
        try {
          const response = await api.get(`/v1/chatbot/sessions/${storedSessionId}`);
          setSessionId(response.data.session_id);
          setMessages(response.data.messages ?? []);
          setDraft(response.data.draft ?? null);
          return;
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }

      const response = await api.post('/v1/chatbot/sessions');
      window.localStorage.setItem(STORAGE_KEY, response.data.session_id);
      setSessionId(response.data.session_id);
      setMessages(response.data.messages ?? []);
      setDraft(response.data.draft ?? null);
    } catch (loadError) {
      setError(loadError?.response?.data?.detail || 'Failed to start the AI chatbot session.');
    } finally {
      setLoadingSession(false);
    }
  }

  async function handleNewChat() {
    setPrompt('');
    setPendingFiles([]);
    setPendingLocation(null);
    setMessages([]);
    setDraft(null);
    window.localStorage.removeItem(STORAGE_KEY);
    await bootstrapSession();
  }

  async function handleAttachPhotos(event) {
    const nextFiles = Array.from(event.target.files ?? []);
    if (nextFiles.length === 0) return;
    setPendingFiles((previous) => [...previous, ...nextFiles]);
    event.target.value = '';
  }

  async function handleShareLocation() {
    if (!navigator.geolocation) {
      setError('This browser does not support location sharing.');
      return;
    }

    setError('');
    setStatusText('Getting your current location...');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 15000,
          enableHighAccuracy: true,
        });
      });

      setPendingLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setStatusText('Location attached to the next message.');
    } catch {
      setError('Location access failed. Please allow location permission and retry.');
      setStatusText('');
    }
  }

  async function uploadPendingFiles(files) {
    if (files.length === 0) return [];

    const uploadedPhotoKeys = [];
    for (const file of files) {
      setStatusText(`Uploading ${file.name}...`);
      const uploadMeta = await api.post('/v1/issues/images/upload-url', { file_name: file.name });
      if (!uploadMeta.data?.signed_upload_url) {
        throw new Error(`Failed to prepare upload for ${file.name}.`);
      }
      await axios.put(uploadMeta.data.signed_upload_url, file, {
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
      });
      uploadedPhotoKeys.push(uploadMeta.data.photo_key);
    }

    return uploadedPhotoKeys;
  }

  async function handleSend() {
    if (!sessionId || sending) return;
    if (!prompt.trim() && pendingFiles.length === 0 && !pendingLocation) return;

    const promptText = prompt.trim();
    const filesToSend = [...pendingFiles];
    const locationToSend = pendingLocation ? { ...pendingLocation } : null;
    const turnKey = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const optimisticUserId = `temp-user-${turnKey}`;
    const optimisticAssistantId = `temp-assistant-${turnKey}`;
    const optimisticUserMessage = {
      id: optimisticUserId,
      role: 'user',
      content: promptText || buildContextOnlyMessage(filesToSend.length, Boolean(locationToSend)),
      photo_keys: [],
      photo_urls: [],
      location: locationToSend,
      tool_events: [],
      created_issue_id: null,
      created_at: new Date().toISOString(),
      is_temp: true,
    };
    const optimisticAssistantMessage = {
      id: optimisticAssistantId,
      role: 'assistant',
      content: '',
      photo_keys: [],
      photo_urls: [],
      location: null,
      tool_events: [],
      created_issue_id: null,
      created_at: new Date().toISOString(),
      is_streaming: true,
      is_temp: true,
    };

    setSending(true);
    setError('');
    setStatusText('Preparing your message...');
    setMessages((previous) => [...previous, optimisticUserMessage, optimisticAssistantMessage]);
    setPrompt('');
    setPendingFiles([]);
    setPendingLocation(null);

    try {
      const uploadedPhotoKeys = await uploadPendingFiles(filesToSend);
      const payload = {
        session_id: sessionId,
        message: promptText,
        photo_keys: uploadedPhotoKeys,
        location: locationToSend,
      };

      const updateAssistantMessage = (updater) => {
        setMessages((previous) =>
          previous.map((message) =>
            message.id === optimisticAssistantId ? updater(message) : message
          )
        );
      };

      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(CHATBOT_STREAM_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          let detail = '';
          try {
            detail = JSON.parse(errorText)?.detail || '';
          } catch {}
          throw new Error(detail || errorText || 'Failed to send message to the chatbot.');
        }

        if (!response.body) {
          throw new Error('Streaming is not available in this browser.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let streamCompleted = false;

        while (true) {
          const { done, value } = await reader.read();
          buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

          const events = buffer.split(/\r?\n\r?\n/);
          buffer = events.pop() ?? '';

          for (const rawEvent of events) {
            const dataLine = rawEvent
              .split(/\r?\n/)
              .filter((line) => line.startsWith('data:'))
              .map((line) => line.slice(5).trimStart())
              .join('\n');

            if (!dataLine) continue;
            const event = JSON.parse(dataLine);

            if (event.type === 'status') {
              setStatusText(event.message || '');
              continue;
            }

            if (event.type === 'tool_call') {
              updateAssistantMessage((message) => ({
                ...message,
                tool_events: upsertToolEvent(message.tool_events, {
                  stream_id: event.stream_id,
                  tool: event.tool,
                  status: event.status,
                  message: `Running ${formatToolName(event.tool)}...`,
                  args: event.args || {},
                }),
              }));
              continue;
            }

            if (event.type === 'tool_result') {
              updateAssistantMessage((message) => ({
                ...message,
                tool_events: upsertToolEvent(message.tool_events, {
                  stream_id: event.stream_id,
                  tool: event.tool,
                  status: event.status,
                  message: event.message,
                  args: event.args || {},
                }),
              }));
              continue;
            }

            if (event.type === 'assistant_delta') {
              updateAssistantMessage((message) => ({
                ...message,
                content: `${message.content || ''}${event.delta || ''}`,
              }));
              continue;
            }

            if (event.type === 'complete') {
              streamCompleted = true;
              const turn = event.turn;
              setMessages((previous) =>
                previous.map((message) => {
                  if (message.id === optimisticUserId) return turn.user_message;
                  if (message.id === optimisticAssistantId) return turn.assistant_message;
                  return message;
                })
              );
              setDraft(turn.draft ?? null);
              notifyIssueCreated(turn.created_issue_id);
              setStatusText(turn.created_issue_id ? `Complaint #${turn.created_issue_id} created successfully.` : '');
              continue;
            }

            if (event.type === 'error') {
              throw new Error(event.detail || 'Streaming failed.');
            }
          }

          if (done) {
            break;
          }
        }

        if (!streamCompleted) {
          throw new Error('Stream ended before the final chatbot response arrived.');
        }
      } catch (streamError) {
        console.warn('Chatbot stream failed, falling back to standard response.', streamError);
        setStatusText('Streaming failed. Loading the full response...');
        const response = await api.post('/v1/chatbot/message', payload);
        setMessages((previous) =>
          previous.map((message) => {
            if (message.id === optimisticUserId) return response.data.user_message;
            if (message.id === optimisticAssistantId) return response.data.assistant_message;
            return message;
          })
        );
        setDraft(response.data.draft ?? null);
        notifyIssueCreated(response.data.created_issue_id);
        setStatusText(response.data.created_issue_id ? `Complaint #${response.data.created_issue_id} created successfully.` : '');
      }
    } catch (sendError) {
      setMessages((previous) =>
        previous.filter((message) => message.id !== optimisticUserId && message.id !== optimisticAssistantId)
      );
      setPrompt(promptText);
      setPendingFiles(filesToSend);
      setPendingLocation(locationToSend);
      setError(sendError?.response?.data?.detail || sendError.message || 'Failed to send message to the chatbot.');
      setStatusText('');
    } finally {
      setSending(false);
    }
  }

  function removePendingFile(index) {
    setPendingFiles((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
  }

  function clearPendingLocation() {
    setPendingLocation(null);
  }

  function handlePromptKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">AI Chatbot</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">CivicEase Complaint Chatbot</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
            Ask normal civic questions, or create a complaint by describing the issue, attaching one or more photos, sharing location, and asking the chatbot to submit it.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewChat}
          className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.75fr]">
        <section className={`${card} flex min-h-[72vh] flex-col`}>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                <MessagesSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Chat</h2>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Session {sessionId ? `#${sessionId.slice(0, 8)}` : 'starting'}
                </p>
              </div>
            </div>

            {statusText && <p className="text-xs font-medium text-sky-700">{statusText}</p>}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto py-6">
            {loadingSession ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Starting chatbot session...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-slate-50 via-white to-sky-50 px-6 py-12 text-center ring-1 ring-black/5">
                <Sparkles className="h-7 w-7 text-sky-600" />
                <h3 className="mt-4 text-xl font-bold tracking-tight text-gray-900">Start a civic chat</h3>
                <p className="mt-2 max-w-lg text-sm leading-7 text-gray-600">
                  Try: "There is a pothole near the main market, create a complaint." Then attach a photo and share location from the prompt bar.
                </p>
              </div>
            ) : (
              messages.map((message) => {
                const isAssistant = message.role === 'assistant';
                return (
                  <div
                    key={message.id}
                    className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[1.6rem] px-5 py-4 shadow-sm ring-1 ${
                        isAssistant
                          ? 'bg-slate-900 text-white ring-slate-800'
                          : 'bg-sky-50 text-slate-900 ring-sky-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className={`text-[11px] font-semibold uppercase tracking-wider ${isAssistant ? 'text-slate-300' : 'text-sky-700'}`}>
                          {isAssistant ? 'AI' : 'You'}
                        </p>
                        <p className={`text-[11px] ${isAssistant ? 'text-slate-400' : 'text-slate-500'}`}>{formatTime(message.created_at)}</p>
                      </div>

                      {message.content ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{message.content}</p>
                      ) : message.is_streaming ? (
                        <p className="mt-2 text-sm italic text-slate-300">Thinking...</p>
                      ) : null}

                      {message.tool_events?.length > 0 ? (
                        <div className="mt-4 space-y-2">
                          {message.tool_events.map((toolEvent, index) => {
                            const isRunning = toolEvent.status === 'running';
                            const isCompleted = toolEvent.status === 'completed';
                            const isBlocked = toolEvent.status === 'blocked';
                            const toneClass = isAssistant
                              ? isCompleted
                                ? 'bg-emerald-900/40 text-emerald-100 ring-emerald-700/50'
                                : isBlocked
                                  ? 'bg-amber-900/30 text-amber-100 ring-amber-700/50'
                                  : 'bg-slate-800 text-slate-100 ring-slate-700'
                              : isCompleted
                                ? 'bg-emerald-50 text-emerald-800 ring-emerald-100'
                                : isBlocked
                                  ? 'bg-amber-50 text-amber-800 ring-amber-100'
                                  : 'bg-white text-slate-700 ring-sky-100';

                            return (
                              <div
                                key={`${toolEvent.tool}-${toolEvent.stream_id ?? index}`}
                                className={`rounded-2xl px-3 py-2 text-xs ring-1 ${toneClass}`}
                              >
                                <p className="font-semibold">
                                  {formatToolName(toolEvent.tool)}
                                  {isRunning ? ' · Running' : isCompleted ? ' · Completed' : isBlocked ? ' · Blocked' : ' · Updated'}
                                </p>
                                <p className="mt-1 leading-5">{toolEvent.message}</p>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}

                      {message.location ? (
                        <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ${isAssistant ? 'bg-slate-800 text-slate-200' : 'bg-white text-sky-700 ring-1 ring-sky-100'}`}>
                          <MapPin className="h-3.5 w-3.5" />
                          {message.location.lat.toFixed(5)}, {message.location.lng.toFixed(5)}
                        </div>
                      ) : null}

                      {message.photo_urls?.length > 0 ? (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {message.photo_urls.map((url) => (
                            <img
                              key={url}
                              src={url}
                              alt="Chat attachment"
                              className="h-40 w-full rounded-2xl object-cover ring-1 ring-black/5"
                            />
                          ))}
                        </div>
                      ) : null}

                      {message.created_issue_id ? (
                        <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-100">
                          <p className="font-semibold">Complaint created successfully.</p>
                          <Link className="mt-2 inline-block font-semibold underline" to={`/home/issues/${message.created_issue_id}`}>
                            Open issue #{message.created_issue_id}
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-gray-100 pt-4">
            {pendingFiles.length > 0 || pendingLocation ? (
              <div className="mb-4 flex flex-wrap gap-2">
                {pendingFiles.map((file, index) => (
                  <span
                    key={`${file.name}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 ring-1 ring-sky-100"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    {file.name}
                    <button type="button" onClick={() => removePendingFile(index)}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}

                {pendingLocation ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                    <MapPin className="h-3.5 w-3.5" />
                    Location attached
                    <button type="button" onClick={clearPendingLocation}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ) : null}
              </div>
            ) : null}

            <div className="rounded-[1.75rem] border border-gray-200 bg-gray-50 p-3 shadow-inner">
              <div className="flex items-end gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100"
                    title="Attach photo"
                  >
                    <ImagePlus className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleShareLocation}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100"
                    title="Share location"
                  >
                    <MapPin className="h-4 w-4" />
                  </button>
                </div>

                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={handlePromptKeyDown}
                  placeholder="Ask a question or describe the issue and tell the chatbot to create a complaint..."
                  className="min-h-[52px] flex-1 resize-none rounded-2xl border border-transparent bg-transparent px-2 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending || (!prompt.trim() && pendingFiles.length === 0 && !pendingLocation)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleAttachPhotos}
              />
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className={`${card} space-y-4`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">What It Can Do</p>
              <h2 className="text-lg font-bold tracking-tight text-gray-900">Agentic Complaint Flow</h2>
            </div>
            <div className="space-y-3 text-sm leading-7 text-gray-600">
              <p>Answer normal civic questions with Cerebras Qwen.</p>
              <p>Remember the current complaint draft across messages.</p>
              <p>Use your uploaded photos and shared location during complaint creation.</p>
              <p>Submit the complaint for you when enough information is available.</p>
            </div>
          </section>

          <section className={`${card} space-y-4`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Complaint Draft</p>
              <h2 className="text-lg font-bold tracking-tight text-gray-900">Current Memory</h2>
            </div>

            {draft ? (
              <div className="space-y-3">
                {draftLine('Title', draft.title)}
                {draftLine('Description', draft.description)}
                {draftLine(
                  'Location',
                  draft.location ? `${draft.location.lat.toFixed(5)}, ${draft.location.lng.toFixed(5)}` : ''
                )}
                {draftLine('Photo Evidence', draft.photo_keys?.length ? `${draft.photo_keys.length} photo(s) attached` : '')}
                <div className={`rounded-2xl px-4 py-3 text-sm font-semibold ring-1 ${draft.ready_to_submit ? 'bg-emerald-50 text-emerald-800 ring-emerald-100' : 'bg-amber-50 text-amber-800 ring-amber-100'}`}>
                  {draft.ready_to_submit ? 'Ready to submit a complaint' : 'Waiting for more complaint details'}
                </div>
                {draft.submitted_issue_id ? (
                  <Link
                    to={`/home/issues/${draft.submitted_issue_id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
                  >
                    Open last submitted issue #{draft.submitted_issue_id}
                  </Link>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-gray-500">The chatbot draft will appear here after your first message.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

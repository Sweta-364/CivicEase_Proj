import { useState } from 'react';
import api from '../../api';
import { TypingIndicator, SpinnerWithMessage } from '../../components/Skeletons';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

export default function AssistantPage() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function send(event) {
    event.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      const response = await api.post('/v1/agent/chat', { message });
      setHistory((prev) => [
        ...prev,
        { user: message, reply: response.data.reply, tool: response.data.tool_used, result: response.data.tool_result },
      ]);
      setMessage('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">AI Chat</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Assistant</h1>
      </div>

      <form onSubmit={send} className="flex gap-3">
        <input
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm ring-1 ring-black/5 transition-colors focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask the assistant..."
        />
        <button
          className="shrink-0 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:opacity-50 active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? <SpinnerWithMessage message="Thinking..." size="sm" /> : 'Send'}
        </button>
      </form>

      <div className="space-y-4">
        {loading && <TypingIndicator />}
        {history.map((item, index) => (
          <div key={index} className={static_card_style}>
            <div className="flex items-start gap-3 mb-3">
              <span className="shrink-0 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-800 ring-1 ring-sky-100">You</span>
              <p className="text-sm text-gray-900">{item.user}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-600 ring-1 ring-gray-200">AI</span>
              <p className="text-sm text-gray-700 leading-relaxed">{item.reply}</p>
            </div>
            {item.tool && (
              <p className="mt-3 text-xs font-medium uppercase tracking-wider text-gray-400">Tool used: {item.tool}</p>
            )}
            {item.result != null && (
              <pre className="mt-3 overflow-auto rounded-xl bg-gray-50 p-4 text-xs text-gray-600 ring-1 ring-gray-100">
                {JSON.stringify(item.result, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

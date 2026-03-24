import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot, Wrench, ChevronDown, ChevronRight, Loader2, Send } from 'lucide-react';
import api from '../../api';

function ToolCallResult({ tool, result }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50/50 overflow-hidden text-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-100 hover:bg-gray-200/50 transition-colors text-gray-700 font-medium"
      >
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-emerald-600" />
          <span>Used tool: <code className="text-emerald-700 font-mono text-[13px] bg-emerald-100/50 px-1.5 py-0.5 rounded">{tool}</code></span>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>
      
      {expanded && result != null && (
        <div className="p-4 border-t border-gray-200 overflow-auto bg-gray-900">
          <pre className="text-[13px] leading-relaxed text-emerald-400 font-mono m-0">
            {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function AssistantPage() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your CivicEase AI Assistant. I can help you analyze civic issues, look up user clusters, find resources, or manage posts. How can I assist you today?",
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  async function send(event) {
    event.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage('');
    
    setHistory((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    
    try {
      const response = await api.post('/v1/agent/chat', { message: userMessage });
      setHistory((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: response.data.reply, 
          tool: response.data.tool_used, 
          result: response.data.tool_result 
        },
      ]);
    } catch (error) {
      console.error(error);
      setHistory((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: "I'm sorry, I encountered an error communicating with the server. Please try again later.",
          isError: true
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-black/5">
      
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-100 bg-white p-6 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
          <Bot className="w-8 h-8 text-sky-500" />
          CivicEase AI
        </h1>
        <p className="text-sm text-gray-500 mt-1 ml-11">Powered by Cerebras LLM & CivicEase APIs</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth bg-gray-50/30">
        <div className="space-y-8 pb-4">
          {history.map((item, index) => (
            <div 
              key={index} 
              className={`flex gap-4 ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Assistant Avatar */}
              {item.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white mt-1 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              {/* Message Bubble */}
              <div 
                className={`max-w-[85%] ${
                  item.role === 'user' 
                    ? 'bg-gray-900 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 shadow-sm' 
                    : 'bg-white border border-gray-100/50 text-gray-800 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm ring-1 ring-black/[0.03]'
                } ${item.isError ? 'bg-red-50 text-red-700 ring-red-100' : ''}`}
              >
                {/* Markdown Content */}
                <div className={`prose prose-sm max-w-none ${item.role === 'user' ? 'prose-invert' : 'prose-gray'}`}>
                  {item.role === 'assistant' ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {item.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="m-0 whitespace-pre-wrap">{item.content}</p>
                  )}
                </div>

                {/* Tool Usage Display */}
                {item.tool && (
                  <ToolCallResult tool={item.tool} result={item.result} />
                )}
              </div>

              {/* User Avatar */}
              {item.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 mt-1">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-4 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white mt-1 shadow-sm opacity-80">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-gray-100/50 rounded-2xl rounded-tl-sm px-6 py-4 flex items-center gap-2 text-gray-500 text-sm shadow-sm ring-1 ring-black/[0.03]">
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 bg-white border-t border-gray-100">
        <form onSubmit={send} className="relative flex items-center max-w-4xl mx-auto">
          <input
            className="w-full bg-gray-100/80 text-gray-900 rounded-full pl-6 pr-14 py-4 text-sm ring-1 ring-inset ring-transparent transition-all hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 shadow-inner"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message CivicEase AI..."
            autoComplete="off"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="absolute right-2 p-2.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-gray-900 transition-all flex items-center justify-center active:scale-95"
          >
            <Send className="w-4 h-4 translate-x-[1px] translate-y-[-1px]" />
          </button>
        </form>
        <p className="text-center text-[11px] text-gray-400 mt-3">
          AI generated information may be inaccurate. Verify important details.
        </p>
      </div>

    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AIChatbot = () => {
  const defaultMessage = [
    {
      role: 'assistant',
      text: 'Welcome to Crime Intelligence Assistant. Ask me about crime patterns, high-risk zones, or prediction insights.'
    }
  ];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(defaultMessage);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  useEffect(() => {
    if (!open) {
      setMessages(defaultMessage);
    }
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try { 
      const { data } = await axios.post(`${BACKEND_URL}/api/chatbot`, { message: userMsg }, { withCredentials: true });
      setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-6 z-[60] w-14 h-14 rounded-full bg-[#00F0FF] text-black flex items-center justify-center shadow-lg drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]"
        data-testid="chatbot-toggle"
      >
        {open ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-36 right-6 z-[60] w-[380px] max-h-[500px] flex flex-col rounded-lg overflow-hidden border border-white/10 backdrop-blur-2xl bg-black/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            data-testid="chatbot-window"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00F0FF]/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#00F0FF]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Crime Intelligence AI
                </h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
                  <span className="text-xs text-[#52525B]">Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px] max-h-[340px]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-[#00F0FF]/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-[#00F0FF]" />
                    </div>
                  )}
                  <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-[#00F0FF]/15 text-white border border-[#00F0FF]/20'
                      : 'bg-white/5 text-[#A1A1AA] border border-white/5'
                  }`} style={{ fontFamily: msg.role === 'assistant' ? "'JetBrains Mono', monospace" : "'Manrope', sans-serif", fontSize: '13px', lineHeight: '1.5' }}>
                    {msg.text}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#00F0FF]/20 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-[#00F0FF]" />
                  </div>
                  <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about crime patterns..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-[#52525B] focus:outline-none focus:border-[#00F0FF]/50"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                  data-testid="chatbot-input"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="p-2 rounded-md bg-[#00F0FF] text-black hover:bg-[#33F3FF] disabled:opacity-50 transition-colors"
                  data-testid="chatbot-send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;

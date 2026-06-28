import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, Trash2 } from 'lucide-react';
import { PageTransition } from '../layout';
import { GlassCard, GlassButton, Badge, cn } from '../components/ui/Glass';
import { ChatBubble, TypingIndicator } from '../components/chat/Chat';
import { callWebhook } from '../services/api';
import { useChatStore } from '../store';
import { parseWebhookResponse } from '../utils';

const SUGGESTED_PROMPTS = [
  "How do I sell my product?",
  "Best Lines to attract someone to our product."
];

export default function SalesConsultant() {
  const { sessionId, messages, isGenerating, addMessage, setGenerating, clearChat } = useChatStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isGenerating) return;
    
    setInput('');
    setError('');
    addMessage({ role: 'user', content: text });
    setGenerating(true);

    try {
      const response = await callWebhook(
        import.meta.env.VITE_SALES_CHAT_WEBHOOK,
        { 
          sessionId,
          chatInput: text,
          history: messages 
        }
      );
      
      const assistantMessage = parseWebhookResponse(response);
      addMessage({ role: 'assistant', content: assistantMessage });
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <PageTransition>
      <div className="h-full min-h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white shadow-lg">
              <Bot size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">FlowMind Chat Assistant</h2>
                <Badge>New</Badge>
              </div>
              <p className="text-sm text-secondary-text">Sales Consultant</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button 
              onClick={clearChat}
              className="p-2 text-secondary-text hover:text-danger hover:bg-danger/10 rounded-xl transition-colors flex items-center gap-2 text-sm"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}
        </div>

        {/* Chat Area */}
        <GlassCard surface className="flex-1 flex flex-col overflow-hidden relative">
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <Bot size={48} className="text-accent-blue/50 mb-4" />
                <h3 className="text-lg font-medium text-primary-text mb-2">How can I help you sell today?</h3>
                <p className="text-secondary-text mb-8 max-w-md">
                  I am your AI Sales Consultant. Ask me for strategies, scripts, or advice on handling tough clients.
                </p>
                <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:border-accent-blue/30 text-sm transition-all text-secondary-text hover:text-primary-text"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
                {isGenerating && <TypingIndicator />}
                {error && (
                  <div className="mx-auto max-w-lg px-4 py-2 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm text-center">
                    {error}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Composer */}
          <div className="p-4 bg-black/10 dark:bg-black/20 border-t border-border/50">
            <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
              <button className="p-3 text-secondary-text hover:text-primary-text hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors shrink-0">
                <Paperclip size={20} />
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here..."
                  className={cn(
                    "w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl pl-4 pr-12 py-3.5 text-sm",
                    "text-primary-text placeholder:text-primary-text/50 dark:placeholder:text-secondary-text/70 resize-none max-h-32 hide-scrollbar",
                    "focus:outline-none focus:border-accent-blue transition-all"
                  )}
                  rows={1}
                  style={{ minHeight: '52px' }}
                />
              </div>

              <GlassButton
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isGenerating}
                className="w-[52px] h-[52px] !p-0 rounded-2xl shrink-0"
              >
                <Send size={20} className={input.trim() ? 'text-white' : 'text-secondary-text'} />
              </GlassButton>
            </div>
          </div>
        </GlassCard>

      </div>
    </PageTransition>
  );
}

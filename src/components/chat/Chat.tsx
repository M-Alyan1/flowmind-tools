import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { motion } from 'framer-motion';
import { Bot, User, Copy, Check, Send, RotateCcw } from 'lucide-react';
import { GlassCard, cn } from '../ui/Glass';
import { ChatMessage } from '../../store';

export const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4 w-full",
        isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
        isAssistant 
          ? "bg-gradient-to-br from-[#0A84FF] to-[#7C5CFF] text-white shadow-[0_4px_12px_rgba(10,132,255,0.3)]" 
          : "bg-black/10 dark:bg-black/40 border border-black/10 dark:border-white/10 text-primary-text dark:text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
      )}>
        {isAssistant ? <Bot size={16} /> : <User size={16} />}
      </div>
      
      <div className={cn(
        "relative group max-w-[85%]",
        isAssistant ? "text-left" : "text-right"
      )}>
        <div 
          className={cn(
            "p-4 text-sm leading-relaxed",
            isAssistant 
              ? "bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl rounded-tl-sm text-primary-text dark:text-[#B8BDC7] shadow-[0_4px_16px_rgba(0,0,0,0.2)]" 
              : "bg-[#0A84FF]/20 border border-[#0A84FF]/30 rounded-2xl rounded-tr-sm text-white shadow-[0_4px_16px_rgba(10,132,255,0.15)] text-left"
          )}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        {isAssistant && (
          <button 
            onClick={handleCopy}
            className="absolute -right-10 top-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-secondary-text hover:text-primary-text hover:bg-black/5 dark:hover:bg-white/10"
            title="Copy message"
          >
            {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex gap-4 w-full max-w-3xl mr-auto"
  >
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A84FF] to-[#7C5CFF] shadow-[0_4px_12px_rgba(10,132,255,0.3)] flex items-center justify-center shrink-0 mt-1">
      <Bot size={16} className="text-white" />
    </div>
    <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5 h-12 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-secondary-text rounded-full" />
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-secondary-text rounded-full" />
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-secondary-text rounded-full" />
    </div>
  </motion.div>
);

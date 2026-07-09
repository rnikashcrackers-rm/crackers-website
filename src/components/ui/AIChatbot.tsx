'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Trash2, ShoppingCart, Check, HelpCircle, ArrowRight, Bot } from 'lucide-react';
import { useEnquiryStore } from '@/lib/store/enquiryStore';
import { products as staticProducts } from '@/lib/data/products';
import { useToast } from '@/components/ui/Toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface RecItem {
  id: string;
  quantity: number;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const items = useEnquiryStore((state) => state.items);
  const addItem = useEnquiryStore.getState().addItem;
  const { addToast } = useToast();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadWelcomeMessage = () => {
    const welcomeMsg: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! Welcome to the **NIKASH CRACKERS AI Assistant**! 🎆\n\nI am your virtual pyrotechnics guide directly from Sivakasi. I can help you:\n1. **Recommend Custom Packages** according to your budget (e.g. "Suggest a bundle for ₹5,000")\n2. **Search Products & Categories** (e.g. "Show me rockets")\n3. **Track Your Order Status**\n4. **Answer FAQ & Safety Guidelines**\n\nHow can I help you light up your celebrations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMsg]);
  };

  const clearChat = () => {
    sessionStorage.removeItem('jj_chat_history');
    loadWelcomeMessage();
    addToast('Chat history cleared', 'info');
  };

  // Initialize messages on mount (load from sessionStorage if exists, otherwise load default welcome)
  useEffect(() => {
    const saved = sessionStorage.getItem('jj_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        loadWelcomeMessage();
      }
    } else {
      loadWelcomeMessage();
    }
  }, []);

  // Save history to sessionStorage whenever it changes
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('jj_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when messages list or loading state updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  // Helper to extract recommendation tags from message content
  const parseMessageContent = (text: string) => {
    const match = text.match(/<recommendations>([\s\S]*?)<\/recommendations>/);
    if (match) {
      try {
        const recs: RecItem[] = JSON.parse(match[1]);
        const cleanedText = text.replace(/<recommendations>([\s\S]*?)<\/recommendations>/g, '').trim();
        return { recommendations: recs, text: cleanedText };
      } catch (e) {
        console.error('Failed to parse recommendations JSON:', e);
      }
    }
    return { recommendations: null, text };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || input;
    if (!rawText.trim() || isLoading) return;

    if (!textToSend) setInput('');

    // Add user message
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: rawText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Send last 8 messages to keep prompt size optimized
          messages: newMessages.slice(-8).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I am having trouble connecting to my engine right now. Please try again, or chat directly with our team on WhatsApp for immediate assistance!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProductToCart = (productId: string) => {
    const prod = staticProducts.find(p => p.id === productId);
    if (prod) {
      addItem({ product: prod as any, quantity: 1 });
      addToast(`Added ${prod.name_en} to cart!`, 'success');
    }
  };

  const handleAddAllToCart = (recs: RecItem[]) => {
    let addedCount = 0;
    recs.forEach(rec => {
      const prod = staticProducts.find(p => p.id === rec.id);
      if (prod) {
        addItem({ product: prod as any, quantity: rec.quantity || 1 });
        addedCount++;
      }
    });
    if (addedCount > 0) {
      addToast(`Added ${addedCount} items to cart! 🎆`, 'success');
    }
  };

  // Pre-formatted messages for chips
  const quickActions = [
    { label: 'Suggest a ₹3,000 Pack', query: 'Recommend a combo package for a budget of ₹3000' },
    { label: 'Suggest a ₹5,000 Pack', query: 'Recommend a combo package for a budget of ₹5000' },
    { label: 'Show me Sparklers ✨', query: 'Show me your available sparklers' },
    { label: 'Minimum Order & Shipping 🚚', query: 'What is the shipping cost and minimum order value?' },
    { label: 'Handling Safety Rules 🔥', query: 'What are the safety rules for handling crackers?' },
  ];

  return (
    <div suppressHydrationWarning className="fixed bottom-24 right-6 z-50">
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-[var(--color-coral-light)] via-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] flex items-center justify-center shadow-[0_4px_24px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.6)] transition-all cursor-pointer relative"
        aria-label="Toggle AI Concierge"
        id="ai-chatbot-fab"
      >
        {isOpen ? (
          <X size={24} className="animate-spin-once" />
        ) : (
          <>
            <Bot size={24} className="animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full shadow-lg" />
          </>
        )}
      </motion.button>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.8, x: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[420px] h-[75vh] max-h-[640px] rounded-[2rem] border border-[var(--border)]/10 bg-[#1C1C18]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-[1000] border-temple"
          >
            {/* Header */}
            <div className="px-6 py-5 bg-[var(--surface-high)]/60 border-b border-[var(--border)]/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] flex items-center justify-center shadow-lg">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                    JJ AI Concierge
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute" />
                    <span className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-wider">Expert Assistant</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  title="Clear conversation"
                  className="p-2 text-[var(--text-muted)] hover:text-rose-400 hover:bg-white/5 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-[var(--text-muted)] hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin">
              {messages.map((m) => {
                const parsed = parseMessageContent(m.content);
                const isAssistant = m.role === 'assistant';
                
                // Find products if recommendations are present
                const recommendedItems = parsed.recommendations
                  ? parsed.recommendations.map(rec => {
                      const prod = staticProducts.find(p => p.id === rec.id);
                      return prod ? { product: prod, quantity: rec.quantity } : null;
                    }).filter(Boolean)
                  : [];

                return (
                  <div key={m.id} className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
                    {/* Speech bubble */}
                    <div
                      className={`max-w-[85%] rounded-[1.8rem] px-5 py-3.5 text-sm leading-relaxed ${
                        isAssistant
                          ? 'bg-[var(--surface-high)] border border-[var(--border)]/10 text-white/95 rounded-tl-sm font-light'
                          : 'bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] rounded-tr-sm font-bold shadow-lg'
                      }`}
                    >
                      {/* Markdown simple renderer */}
                      <div className="space-y-1.5 select-text">
                        {parsed.text.split('\n').map((line, idx) => {
                          // Bold markers
                          const boldRegex = /\*\*(.*?)\*\*/g;
                          const matches = Array.from(line.matchAll(boldRegex));
                          
                          if (matches.length > 0) {
                            return (
                              <p key={idx} className="whitespace-pre-wrap">
                                {line.split(/\*\*(.*?)\*\*/).map((part, pIdx) => {
                                  // Every odd index in this split is the bold group
                                  return pIdx % 2 === 1 ? (
                                    <strong key={pIdx} className={isAssistant ? 'text-[var(--color-coral)] font-bold' : 'font-extrabold text-black'}>
                                      {part}
                                    </strong>
                                  ) : (
                                    part
                                  );
                                })}
                              </p>
                            );
                          }
                          
                          // Strike-through (line-through) support for MRPs
                          if (line.includes('line-through')) {
                            const cleanLine = line.replace(/<span class="line-through">.*?<\/span>/g, '').replace(/MRP: /g, '');
                            const mrpMatch = line.match(/line-through">₹(\d+)</);
                            const mrpValue = mrpMatch ? mrpMatch[1] : '';
                            return (
                              <p key={idx}>
                                {cleanLine} {mrpValue && <span className="line-through text-white/40">MRP: ₹{mrpValue}</span>}
                              </p>
                            );
                          }
                          
                          return <p key={idx} className="whitespace-pre-wrap">{line}</p>;
                        })}
                      </div>

                      {/* Time stamp */}
                      <span className={`text-[9px] block text-right mt-1.5 opacity-50 ${isAssistant ? 'text-white/40' : 'text-[#1a1400]/60'}`}>
                        {m.timestamp}
                      </span>
                    </div>

                    {/* Interactive Recommendations Rendering */}
                    {isAssistant && recommendedItems.length > 0 && (
                      <div className="w-full mt-3 space-y-3 pl-2">
                        <div className="flex items-center justify-between pr-2">
                          <span className="text-[10px] uppercase font-black text-[var(--color-coral)] tracking-widest flex items-center gap-1.5">
                            <ShoppingCart size={10} /> Interactive Options
                          </span>
                          {recommendedItems.length > 1 && (
                            <button
                              onClick={() => handleAddAllToCart(parsed.recommendations!)}
                              className="text-[10px] bg-[var(--color-coral)]/10 border border-[var(--color-coral)]/30 hover:bg-[var(--color-coral)] hover:text-[#1a1400] text-[var(--color-coral)] px-2.5 py-1 rounded-full font-bold transition-all flex items-center gap-1 cursor-pointer"
                            >
                              Add All to Cart
                            </button>
                          )}
                        </div>
                        
                        {/* Horizontal Carousel of Recommended Cards */}
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin max-w-full">
                          {recommendedItems.map((item, index) => {
                            if (!item) return null;
                            const isAlreadyInCart = items.some(cartItem => cartItem.product.id === item.product.id);

                            return (
                              <div
                                key={index}
                                className="w-[170px] bg-[var(--surface)] border border-[var(--border)]/10 rounded-2xl p-3 shrink-0 flex flex-col justify-between hover:border-[var(--color-coral)]/30 transition-all shadow-sm"
                              >
                                <div>
                                  <div className="text-[9px] text-[var(--color-coral)] font-bold uppercase tracking-wider mb-1 truncate">
                                    {item.product.category.replace('-', ' ')}
                                  </div>
                                  <h4 className="text-xs font-bold text-white leading-tight mb-1 line-clamp-2">
                                    {item.product.name_en}
                                  </h4>
                                </div>
                                
                                <div className="mt-3">
                                  <div className="flex items-baseline justify-between mb-2">
                                    <span className="text-xs font-bold text-[var(--color-coral)]">₹{item.product.price}</span>
                                    <span className="text-[10px] text-[var(--text-muted)] line-through">₹{item.product.mrp}</span>
                                  </div>
                                  
                                  <button
                                    onClick={() => handleAddProductToCart(item.product.id)}
                                    className={`w-full py-1.5 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                      isAlreadyInCart
                                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20'
                                        : 'bg-[var(--surface-high)] border border-[var(--border)] hover:border-[var(--color-coral)] hover:bg-[var(--color-coral)] hover:text-[#1a1400] text-white'
                                    }`}
                                  >
                                    {isAlreadyInCart ? (
                                      <><Check size={10} /> Added</>
                                    ) : (
                                      <><ShoppingCart size={10} /> Add to Cart</>
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-[var(--surface-high)] border border-[var(--border)]/10 text-white rounded-[1.8rem] rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[var(--color-coral)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[var(--color-coral)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[var(--color-coral)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Chips */}
            {messages.length === 1 && !isLoading && (
              <div className="px-6 py-2 bg-gradient-to-t from-[var(--surface)] to-transparent border-t border-[var(--border)]/5">
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 flex items-center gap-1">
                  <HelpCircle size={10} /> Quick Suggestions
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {quickActions.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip.query)}
                      className="px-3.5 py-1.5 rounded-full bg-[var(--surface-high)] hover:bg-[var(--color-coral)] hover:text-[#1a1400] border border-[var(--border)]/5 text-white/80 hover:text-black font-semibold text-[11px] whitespace-nowrap cursor-pointer transition-all flex items-center gap-1"
                    >
                      {chip.label} <ArrowRight size={10} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-4 bg-[var(--surface-high)]/90 border-t border-[var(--border)]/5 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Type your question or budget..."
                className="flex-1 bg-[var(--surface)] border border-[var(--border)]/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[var(--color-coral)]/60 focus:ring-1 focus:ring-[var(--color-coral)]/30 disabled:opacity-50 transition-all font-light"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-coral-dark)] hover:shadow-lg disabled:shadow-none hover:shadow-[var(--color-coral)]/10 text-[#1a1400] flex items-center justify-center shrink-0 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

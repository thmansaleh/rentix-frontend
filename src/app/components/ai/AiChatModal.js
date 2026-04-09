'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Copy, Check, Sparkles, X, Trash2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/slices/authSlice';
import { chatWithRentCarAssistant } from '@/app/services/api/rentCarAssistant';

const AiChatModal = ({ isOpen, onClose }) => {
  const { isRTL } = useLanguage();
  const user = useSelector(selectUser);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 120);
  }, [isOpen]);

  const handleCopyMessage = async (messageId, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleClearChat = () => setMessages([]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userName = user?.employeeName || user?.name || user?.email || 'User';

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      userName,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const data = await chatWithRentCarAssistant({
        message: userMessage.content,
        userName,
        userId: user?.id || user?.job_id,
        history: messages,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.answer,
          sources: data.sources,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: isRTL
            ? 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.'
            : 'Sorry, a connection error occurred. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestion = async (suggestion) => {
    const text = isRTL ? suggestion.suggestAR : suggestion.suggestEn;

    if (suggestion.isMessageInput) {
      setInputMessage(text);
      inputRef.current?.focus();
      return;
    }

    if (isLoading) return;

    const userName = user?.employeeName || user?.name || user?.email || 'User';
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      userName,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await chatWithRentCarAssistant({
        message: text,
        userName,
        userId: user?.id || user?.job_id,
        history: messages,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.answer,
          sources: data.sources,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error sending suggestion:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: isRTL
            ? 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.'
            : 'Sorry, a connection error occurred. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString(isRTL ? 'ar-AE' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const userInitials = (() => {
    const name = user?.employeeName || user?.name || '';
    return (
      name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase() || 'U'
    );
  })();

  const suggestions = [
    { suggestAR: 'ما هي السيارات المتاحة؟',            suggestEn: 'What cars are available?',                  isMessageInput: false },
    { suggestAR: 'كم رصيد سالك؟',                      suggestEn: 'What is my Salik balance?',                 isMessageInput: false },
    { suggestAR: 'كم مصروفات المكتب اخر اسبوع؟',       suggestEn: 'Office expenses for the last week?',        isMessageInput: false },
    { suggestAR: 'كم المبالغ الغير مسددة او المتبقية على العميل 0501455918؟',       suggestEn: 'What are the unpaid amounts or remaining balance for customer 0501455918?',    isMessageInput: true  },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-2xl h-[85vh] max-h-[700px] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border-0 shadow-2xl"
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3.5 flex-shrink-0 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles size={17} className="text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-purple-600 rounded-full" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white leading-tight">
                {isRTL ? 'مساعد إدارة السيارات' : 'Car Rental AI Assistant'}
              </h2>
              <p className="text-[11px] text-white/70 leading-tight">
                {isRTL ? 'متصل الآن' : 'Online now'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                className="h-8 w-8 rounded-full text-white/80 hover:text-white hover:bg-white/20"
                aria-label={isRTL ? 'مسح المحادثة' : 'Clear conversation'}
                title={isRTL ? 'مسح المحادثة' : 'Clear conversation'}
              >
                <Trash2 size={15} />
              </Button>
            )}
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-white/80 hover:text-white hover:bg-white/20"
                aria-label={isRTL ? 'إغلاق' : 'Close'}
              >
                <X size={17} />
              </Button>
            </DialogClose>
          </div>
        </div>

        {/* ── Messages ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 bg-muted/20">
          <div className="space-y-5">

            {/* Empty state */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center text-center mt-4 px-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 flex items-center justify-center mb-3 shadow-sm">
                  <Sparkles className="text-purple-600 dark:text-purple-400" size={26} />
                </div>
                <p className="text-base font-semibold text-foreground mb-1">
                  {isRTL ? 'مرحباً! أنا مساعدك الذكي' : "Hi! I'm your AI assistant"}
                </p>
                <p className="text-sm text-muted-foreground mb-5 max-w-xs">
                  {isRTL
                    ? 'يمكنني مساعدتك في إدارة السيارات والعقود والحجوزات'
                    : 'I can help you with car management, contracts, and bookings'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((s) => (
                    <button
                      key={s.suggestEn}
                      onClick={() => handleSuggestion(s)}
                      className={`px-3 py-1.5 text-xs rounded-full border bg-background transition-colors cursor-pointer disabled:opacity-50 ${
                        s.isMessageInput
                          ? 'border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                          : 'border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                      }`}
                      disabled={isLoading && !s.isMessageInput}
                      title={s.isMessageInput ? (isRTL ? 'سيُملأ في خانة الإدخال' : 'Fills the input') : (isRTL ? 'سيُرسَل تلقائياً' : 'Auto-sends')}
                    >
                      {isRTL ? s.suggestAR : s.suggestEn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message list */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                      : 'bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 text-purple-700 dark:text-purple-300'
                  }`}
                >
                  {message.role === 'user' ? userInitials : <Bot size={13} />}
                </div>

                <div
                  className={`flex flex-col gap-1 max-w-[75%] ${
                    message.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-2.5 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-sm'
                        : 'bg-background dark:bg-card text-foreground border shadow-sm rounded-bl-sm'
                    }`}
                    dir="auto"
                  >
                    <div className="text-sm leading-relaxed">
                      {message.role === 'assistant'
                        ? message.content.split('\n').map((line, i, arr) => (
                            <React.Fragment key={i}>
                              {line}
                              {i < arr.length - 1 && <br />}
                            </React.Fragment>
                          ))
                        : <p className="whitespace-pre-wrap m-0">{message.content}</p>}
                    </div>

                    {message.sources && (
                      <div className="mt-2 pt-2 border-t border-current/10 text-xs opacity-70">
                        <strong>{isRTL ? 'المصادر:' : 'Sources:'}</strong> {message.sources}
                      </div>
                    )}
                  </div>

                  {/* Meta row: time + copy */}
                  <div
                    className={`flex items-center gap-1.5 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {message.timestamp && (
                      <span className="text-[10px] text-muted-foreground select-none">
                        {formatTime(message.timestamp)}
                      </span>
                    )}
                    {message.role === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyMessage(message.id, message.content)}
                        className="h-5 w-5 opacity-50 hover:opacity-100 transition-opacity"
                        aria-label={isRTL ? 'نسخ الرسالة' : 'Copy message'}
                        title={isRTL ? 'نسخ الرسالة' : 'Copy message'}
                      >
                        {copiedId === message.id ? (
                          <Check size={11} className="text-green-600" />
                        ) : (
                          <Copy size={11} />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-end gap-2">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 flex items-center justify-center">
                  <Bot size={13} className="text-purple-700 dark:text-purple-300" />
                </div>
                <div className="bg-background dark:bg-card border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── Input ──────────────────────────────────────────────────── */}
        <div className="px-4 pt-3 pb-3 border-t bg-background flex-shrink-0">
          <div className="flex gap-2 items-center" dir={isRTL ? 'rtl' : 'ltr'}>
            <Input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRTL ? 'اكتب سؤالك هنا...' : 'Type your question here...'}
              className="flex-1 rounded-xl border-muted-foreground/25 focus-visible:ring-purple-500 focus-visible:border-purple-400 h-10"
              disabled={isLoading}
              dir="auto"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl h-10 w-10 p-0 flex-shrink-0 disabled:opacity-40 transition-all"
              size="icon"
              aria-label={isRTL ? 'إرسال' : 'Send message'}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={17} />
              ) : (
                <Send size={17} />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/60 text-center mt-2 select-none">
            {isRTL ? 'اضغط Enter للإرسال' : 'Press Enter to send'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiChatModal;

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/slices/authSlice';

const LegalChatPopup = ({ isOpen, onClose }) => {
  const { isRTL } = useLanguage();
  const user = useSelector(selectUser);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyMessage = async (messageId, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userName = user?.employeeName || user?.name || user?.email || 'User';

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      userName: userName,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/legal-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          userName: userName,
          userId: user?.id || user?.job_id,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Modal Card - Centered */}
      <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl h-[600px] flex flex-col shadow-2xl border-2 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-background border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-purple-600 dark:text-purple-400 animate-pulse" />
            <h2 className="text-lg font-semibold text-foreground">{isRTL ? 'المساعد القانوني' : 'Legal Assistant'}</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="hover:bg-accent"
            aria-label="Close chat"
          >
            <X size={20} />
          </Button>
        </div>

      {/* Messages Container */}
      <ScrollArea className="flex-1 p-4 bg-background"
        dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-8">
              <Sparkles className="mx-auto mb-2 text-purple-500" size={32} />
              <p className="text-sm">
                {isRTL ? 'مرحباً! كيف يمكنني مساعدتك في الأمور القانونية؟' : 'Hello! How can I help you with legal matters?'}
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                    : 'bg-muted text-foreground border'
                }`}
              >
                {/* User name for user messages */}
                {message.role === 'user' && message.userName && (
                  <div className="text-xs opacity-90 mb-1 font-medium">
                    {message.userName}
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {message.role === 'assistant' ? (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: message.content.replace(/\n/g, '<br/>') 
                      }} 
                    />
                  ) : (
                    <p className="whitespace-pre-wrap m-0">{message.content}</p>
                  )}
                </div>
                {message.sources && (
                  <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
                    <strong>{isRTL ? 'المصادر:' : 'Sources:'}</strong> {message.sources}
                  </div>
                )}
                {message.role === 'assistant' && (
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyMessage(message.id, message.content)}
                      className="h-6 w-6"
                      aria-label="Copy message"
                      title={isRTL ? 'نسخ الرسالة' : 'Copy message'}
                    >
                      {copiedId === message.id ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted border rounded-lg p-3">
                <Loader2 className="animate-spin text-purple-600" size={20} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2" dir={isRTL ? 'rtl' : 'ltr'}>
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isRTL ? 'اكتب سؤالك هنا...' : 'Type your question here...'}
            className="flex-1"
            disabled={isLoading}
            dir="auto"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="icon"
            aria-label="Send message"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </Button>
        </div>
      </div>
    </Card>
    </>
  );
};

export default LegalChatPopup;

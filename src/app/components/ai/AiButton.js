'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LegalChatPopup from './LegalChatPopup';
import { useLanguage } from '@/contexts/LanguageContext';

function AiButton() {
  const { isRTL } = useLanguage();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Fixed Button in Bottom Corner - position based on language */}
      <Button
        onClick={() => setIsChatOpen(true)}
        className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-40 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 group`}
        aria-label={isRTL ? "مساعد الذكاء الاصطناعي" : "AI Assistant"}
      >
        <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-medium hidden md:inline">
          {isRTL ? 'المساعد القانوني' : 'Legal Assistant'}
        </span>
        {/* Glow effect */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/50 to-blue-400/50 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></span>
      </Button>

      {/* Chat Popup */}
      <LegalChatPopup 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
}

export default AiButton;
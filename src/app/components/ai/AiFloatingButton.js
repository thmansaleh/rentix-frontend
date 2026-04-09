'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AiChatModal from './AiChatModal';

const AiFloatingButton = () => {
  const { isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 group`}>
        {/* Tooltip */}
        <div
          className={`absolute bottom-full mb-2 ${isRTL ? 'left-0' : 'right-0'} px-2.5 py-1 bg-foreground text-background text-xs rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md`}
        >
          {isRTL ? 'المساعد الذكي' : 'AI Assistant'}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/40 hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
          aria-label={isRTL ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant'}
        >
          <Sparkles
            size={22}
            className="text-white group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
          />
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 animate-ping opacity-25 pointer-events-none" />
        </button>
      </div>

      <AiChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default AiFloatingButton;

'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LegalChatPopup from './LegalChatPopup';

function LegalAssistantButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Header Button */}
      <Button
        onClick={() => setIsChatOpen(true)}
        variant="ghost"
        size="icon"
        className="relative rounded-xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 hover:from-purple-600/20 hover:to-blue-600/20 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200 group"
        aria-label="Open legal assistant"
      >
        <Sparkles 
          size={20} 
          className="text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 group-hover:rotate-12 transition-all" 
        />
      </Button>

      {/* Chat Popup */}
      <LegalChatPopup 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
}

export default LegalAssistantButton;

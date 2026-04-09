'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AiChatModal from './AiChatModal';

const AiHeaderButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="icon"
        className="relative hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
        aria-label="Open car rental AI assistant"
        title="AI Assistant"
      >
        <Sparkles
          size={18}
          className="text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform duration-300"
        />
        {/* Active dot */}
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full" />
      </Button>

      <AiChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default AiHeaderButton;

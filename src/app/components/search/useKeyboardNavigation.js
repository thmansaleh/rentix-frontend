'use client';

import { useEffect } from 'react';

export const useKeyboardNavigation = ({
  isOpen,
  filteredResults,
  selectedIndex,
  setSelectedIndex,
  setIsOpen,
  setSearchQuery,
  onSelect
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredResults[selectedIndex]) {
            onSelect(filteredResults[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchQuery('');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, setSelectedIndex, setIsOpen, setSearchQuery, onSelect]);
};

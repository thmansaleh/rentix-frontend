import { useEffect } from 'react';

/**
 * Custom hook for keyboard navigation
 * Handles Alt+ArrowUp and Alt+ArrowDown for menu navigation
 */
export const useKeyboardNavigation = (menuItems, activeItem, setActiveItem, handleNavClick) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = menuItems.findIndex(item => item.id === activeItem);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        const prevItem = menuItems[prevIndex];
        setActiveItem(prevItem.id);
        handleNavClick(prevItem.id, prevItem.type);
      } else if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = menuItems.findIndex(item => item.id === activeItem);
        const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        const nextItem = menuItems[nextIndex];
        setActiveItem(nextItem.id);
        handleNavClick(nextItem.id, nextItem.type);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuItems, activeItem, setActiveItem, handleNavClick]);
};

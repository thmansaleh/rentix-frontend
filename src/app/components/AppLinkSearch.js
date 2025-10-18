'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { appLinks } from '@/data/appLinks';

const AppLinkSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { isRTL } = useLanguage();
  const { t } = useTranslations();
  const lang = isRTL ? 'ar' : 'en';

  // Filter links based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLinks([]);
      setIsOpen(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = appLinks.filter(link => {
      const label = link.label[lang].toLowerCase();
      const category = link.category[lang].toLowerCase();
      const keywords = link.keywords[lang].map(k => k.toLowerCase());
      
      return (
        label.includes(query) ||
        category.includes(query) ||
        keywords.some(keyword => keyword.includes(query))
      );
    });

    setFilteredLinks(filtered);
    setIsOpen(filtered.length > 0);
    setSelectedIndex(0);
  }, [searchQuery, lang]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredLinks.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredLinks[selectedIndex]) {
            handleLinkClick(filteredLinks[selectedIndex].route);
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
  }, [isOpen, filteredLinks, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (dropdownRef.current && selectedIndex >= 0) {
      const selectedElement = dropdownRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (route) => {
    router.push(route);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchQuery && filteredLinks.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={t('common.searchPages')}
          className={`
            w-full
            ${isRTL ? 'pr-11 pl-10' : 'pl-11 pr-10'}
            py-2.5
            text-sm
            border
            border-gray-200
            dark:border-gray-700
            rounded-lg
            bg-gray-50
            dark:bg-gray-800
            text-gray-900
            dark:text-gray-100
            placeholder-gray-500
            dark:placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            dark:focus:ring-blue-600
            focus:border-transparent
            focus:bg-white
            dark:focus:bg-gray-750
            transition-all
            duration-200
            hover:bg-white
            dark:hover:bg-gray-750
          `}
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className={`
              absolute
              inset-y-0
              ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'}
              flex
              items-center
              text-gray-400
              hover:text-gray-600
              dark:hover:text-gray-300
              transition-colors
              focus:outline-none
            `}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && filteredLinks.length > 0 && (
        <div
          ref={dropdownRef}
          className={`
            absolute
            ${isRTL ? 'right-0' : 'left-0'}
            w-full
            mt-2
            bg-white
            dark:bg-gray-800
            border
            border-gray-200
            dark:border-gray-700
            rounded-lg
            shadow-lg
            max-h-96
            overflow-y-auto
            z-50
          `}
        >
          {filteredLinks.map((link, index) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.route)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`
                w-full
                px-4
                py-3
                text-${isRTL ? 'right' : 'left'}
                hover:bg-gray-50
                dark:hover:bg-gray-700
                transition-colors
                border-b
                border-gray-100
                dark:border-gray-700
                last:border-b-0
                ${selectedIndex === index ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
              `}
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {link.label[lang]}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {link.category[lang]}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && searchQuery && filteredLinks.length === 0 && (
        <div
          className={`
            absolute
            ${isRTL ? 'right-0' : 'left-0'}
            w-full
            mt-2
            bg-white
            dark:bg-gray-800
            border
            border-gray-200
            dark:border-gray-700
            rounded-lg
            shadow-lg
            px-4
            py-6
            text-center
            z-50
          `}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('common.noResultsFound')}
          </p>
        </div>
      )}
    </div>
  );
};

export default AppLinkSearch;

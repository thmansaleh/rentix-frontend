'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { appLinks } from '@/data/appLinks';
import SearchInput from './SearchInput';
import SearchTypeSelector from './SearchTypeSelector';
import SearchResults from './SearchResults';
import { useSearchAPI } from './useSearchAPI';
import { useKeyboardNavigation } from './useKeyboardNavigation';
import { useClickOutside } from './useClickOutside';
import { ViewCarModal } from '@/app/cars/ViewCarModal';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchType, setSearchType] = useState('system');
  const [isSearching, setIsSearching] = useState(false);
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { isRTL } = useLanguage();
  const { t } = useTranslations();
  const lang = isRTL ? 'ar' : 'en';

  // Custom hooks
  const { performSearch } = useSearchAPI();
  
  useKeyboardNavigation({
    isOpen,
    filteredResults,
    selectedIndex,
    setSelectedIndex,
    setIsOpen,
    setSearchQuery,
    onSelect: handleItemClick
  });

  useClickOutside(searchRef, dropdownRef, () => setIsOpen(false));

  // Search effect
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResults([]);
      setIsOpen(false);
      return;
    }

    const debounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await performSearch(searchQuery, searchType, lang, appLinks);
        setFilteredResults(results);
        setIsOpen(true);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
        setFilteredResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, searchType, lang]);

  // Scroll selected item into view
  useEffect(() => {
    if (dropdownRef.current && selectedIndex >= 0 && filteredResults.length > 0) {
      const selectedElement = dropdownRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex, filteredResults]);

  function handleItemClick(item) {
    if (!item) return;

    if (searchType === 'system') {
      router.push(item.route);
      setSearchQuery('');
      setIsOpen(false);
    } else if (searchType === 'clients') {
      router.push(`/customers/${item.id}`);
      setSearchQuery('');
      setIsOpen(false);
    } else if (searchType === 'cars') {
      // Open modal for cars instead of routing
      setSelectedCarId(item.id);
      setIsCarModalOpen(true);
      setSearchQuery('');
      setIsOpen(false);
    }
  }

  const handleClear = () => {
    setSearchQuery('');
    setIsOpen(false);
  };

  const getPlaceholder = () => {
    switch (searchType) {
      case 'clients':
        return isRTL ? 'ابحث عن عميل...' : 'Search for client...';
      case 'cars':
        return isRTL ? 'ابحث عن سيارة...' : 'Search for car...';
      default:
        return t('common.searchPages');
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder={getPlaceholder()}
        onClear={handleClear}
        onFocus={() => {
          if (searchQuery && filteredResults.length > 0) {
            setIsOpen(true);
          }
        }}
        isRTL={isRTL}
        typeSelector={
          <SearchTypeSelector
            searchType={searchType}
            setSearchType={setSearchType}
            isRTL={isRTL}
          />
        }
      />

      <SearchResults
        isOpen={isOpen}
        isSearching={isSearching}
        searchQuery={searchQuery}
        filteredResults={filteredResults}
        selectedIndex={selectedIndex}
        searchType={searchType}
        dropdownRef={dropdownRef}
        onItemClick={handleItemClick}
        onMouseEnter={setSelectedIndex}
        isRTL={isRTL}
        lang={lang}
    t={t}
      />
      {/* Car View Modal */}
      <ViewCarModal
        isOpen={isCarModalOpen}
        onClose={() => {
          setIsCarModalOpen(false);
          setSelectedCarId(null);
        }}
        carId={selectedCarId}
      />
    
    </div>
  );
};

export default SearchBar;

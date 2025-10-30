'use client';

import React from 'react';
import SearchResultItem from './SearchResultItem';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

const SearchResults = ({
  isOpen,
  isSearching,
  searchQuery,
  filteredResults,
  selectedIndex,
  searchType,
  dropdownRef,
  onItemClick,
  onMouseEnter,
  isRTL,
  lang,
  t
}) => {
  // Loading state
  if (isSearching) {
    return <LoadingState isRTL={isRTL} t={t} />;
  }

  // No results state
  if (isOpen && searchQuery && filteredResults.length === 0) {
    return <EmptyState isRTL={isRTL} t={t} />;
  }

  // Results dropdown
  if (isOpen && filteredResults.length > 0) {
    return (
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
          shadow-xl
          max-h-96
          overflow-y-auto
          z-50
          animate-in
          fade-in-0
          slide-in-from-top-2
          duration-200
        `}
      >
        {filteredResults.map((item, index) => (
          <SearchResultItem
            key={item.id}
            item={item}
            index={index}
            searchType={searchType}
            isSelected={selectedIndex === index}
            onClick={() => onItemClick(item)}
            onMouseEnter={() => onMouseEnter(index)}
            isRTL={isRTL}
            lang={lang}
          />
        ))}
      </div>
    );
  }

  return null;
};

export default SearchResults;

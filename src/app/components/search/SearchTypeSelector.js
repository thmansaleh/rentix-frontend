'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LayoutGrid, Folder, Users, UserCheck, ChevronDown } from 'lucide-react';

const SearchTypeSelector = ({ searchType, setSearchType, isRTL }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const searchTypes = [
    { 
      value: 'system', 
      labelAr: 'النظام', 
      labelEn: 'System',
      icon: LayoutGrid
    },
    { 
      value: 'cases', 
      labelAr: 'الملفات', 
      labelEn: 'Cases',
      icon: Folder
    },
    { 
      value: 'parties', 
      labelAr: 'خصم', 
      labelEn: 'Party',
      icon: Users
    },
    { 
      value: 'clients', 
      labelAr: 'موكل', 
      labelEn: 'Client',
      icon: UserCheck
    }
  ];

  const currentType = searchTypes.find(type => type.value === searchType);
  const CurrentIcon = currentType?.icon;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setSearchType(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-md
          bg-secondary hover:bg-secondary/80
          border border-input
          transition-all duration-200
          text-secondary-foreground
          text-xs font-medium
          ${isRTL ? 'flex-row-reverse' : ''}
        `}
      >
        {CurrentIcon && <CurrentIcon className="w-3.5 h-3.5" />}
        <span className="whitespace-nowrap">
          {isRTL ? currentType?.labelAr : currentType?.labelEn}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className={`
            absolute top-full mt-1 ${isRTL ? 'left-0' : 'right-0'}
            bg-popover text-popover-foreground
            border border-border
            rounded-md shadow-md
            py-1 min-w-[140px]
            z-50
            animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200
          `}
        >
          {searchTypes.map((type) => {
            const Icon = type.icon;
            const isActive = searchType === type.value;
            
            return (
              <button
                key={type.value}
                onClick={() => handleSelect(type.value)}
                className={`
                  w-full flex items-center gap-2 px-3 py-2
                  text-sm transition-colors
                  ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}
                  ${isActive 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-accent/50'
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{isRTL ? type.labelAr : type.labelEn}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchTypeSelector;

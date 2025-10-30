'use client';

import React from 'react';
import { SearchX } from 'lucide-react';

const EmptyState = ({ isRTL, t }) => {
  return (
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
        py-8
        text-center
        z-50
      `}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <SearchX className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('common.noResultsFound')}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;

'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ isRTL, t }) => {
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
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      </div>
    </div>
  );
};

export default LoadingState;

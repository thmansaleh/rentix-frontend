'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from '@/hooks/useTranslations';

/**
 * Quick Actions Bar Component
 * Displays frequently accessed actions with animated borders
 */
function QuickActionsBar() {
  const router = useRouter();
  const t = useTranslations('navigation');
  
  const quickActions = [
    { icon: '/41.png', label: t('sessions'), path: '/cases/sessions' },
    { icon: '/36.png', label: t('tasks'), path: '/cases/my-tasks' },
    { icon: '/archive.png', label: t('cases'), path: '/cases' },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <style jsx>{`
        @keyframes shimmer-flow {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        @keyframes float-in {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes icon-bounce {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(5deg);
          }
        }
        
        @keyframes gradient-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .action-btn {
          animation: float-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
        }
        
        .action-btn::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 0.875rem;
          padding: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(31, 31, 31, 0.2),
            rgba(82, 82, 82, 0.3),
            rgba(115, 115, 115, 0.3),
            rgba(31, 31, 31, 0.2),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer-flow 3s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 1;
          transition: opacity 0.3s ease;
        }
        
        .action-btn:hover::before {
          opacity: 1;
        }
        
        .action-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          background: radial-gradient(
            circle at center,
            rgba(31, 31, 31, 0.05),
            transparent 70%
          );
          opacity: 1;
          animation: glow-pulse 2s ease-in-out infinite;
          transition: opacity 0.4s ease;
        }
        
        .action-btn:hover::after {
          opacity: 1;
          background: radial-gradient(
            circle at center,
            rgba(31, 31, 31, 0.1),
            transparent 70%
          );
        }
        
        .icon-wrapper {
          position: relative;
        }
        
        .icon-wrapper::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            transparent,
            rgba(31, 31, 31, 0.2),
            rgba(82, 82, 82, 0.3),
            rgba(115, 115, 115, 0.3),
            rgba(31, 31, 31, 0.2),
            transparent
          );
          opacity: 1;
          animation: gradient-rotate 3s linear infinite;
          transition: opacity 0.4s ease;
        }
        
        .action-btn:hover .icon-wrapper::before {
          opacity: 1;
        }
        
        .action-btn:hover .icon-wrapper {
          animation: icon-bounce 0.6s ease-in-out;
        }
        
        .action-btn:active {
          transform: scale(0.95);
        }
      `}</style>
      <div className="flex items-center justify-center gap-2 px-3 md:px-6 py-2">
        {quickActions.map((action, index) => {
          return (
            <button
              key={action.path}
              onClick={() => router.push(action.path)}
              className="action-btn relative flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 group cursor-pointer hover:shadow-lg hover:shadow-gray-500/20 hover:-translate-y-0.5"
              style={{
                animationDelay: `${index * 0.15}s`
              }}
              title={action.label}
            >
              <div className="icon-wrapper relative w-9 h-9 flex items-center justify-center z-10">
                <Image 
                  src={action.icon} 
                  alt={action.label}
                  width={36}
                  height={36}
                  className="object-contain opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 relative z-10"
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-all duration-300 relative z-10 group-hover:tracking-wide">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActionsBar;

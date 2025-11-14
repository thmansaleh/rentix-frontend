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
    { 
      icon: '/41.png', 
      label: t('sessions'), 
      path: '/cases/sessions',
      colors: {
        light: { from: 'rgba(99, 102, 241, 0.15)', mid: 'rgba(129, 140, 248, 0.25)', to: 'rgba(165, 180, 252, 0.25)' },
        dark: { from: 'rgba(79, 70, 229, 0.15)', mid: 'rgba(99, 102, 241, 0.25)', to: 'rgba(129, 140, 248, 0.25)' },
        glow: 'rgba(99, 102, 241, 0.08)',
        glowHover: 'rgba(99, 102, 241, 0.12)',
        shadow: 'rgba(99, 102, 241, 0.15)'
      }
    },
    { 
      icon: '/36.png', 
      label: t('tasks'), 
      path: '/cases/my-tasks',
      colors: {
        light: { from: 'rgba(16, 185, 129, 0.15)', mid: 'rgba(52, 211, 153, 0.25)', to: 'rgba(110, 231, 183, 0.25)' },
        dark: { from: 'rgba(5, 150, 105, 0.15)', mid: 'rgba(16, 185, 129, 0.25)', to: 'rgba(52, 211, 153, 0.25)' },
        glow: 'rgba(16, 185, 129, 0.08)',
        glowHover: 'rgba(16, 185, 129, 0.12)',
        shadow: 'rgba(16, 185, 129, 0.15)'
      }
    },
    { 
      icon: '/archive.png', 
      label: t('cases'), 
      path: '/cases',
      colors: {
        light: { from: 'rgba(251, 146, 60, 0.15)', mid: 'rgba(251, 191, 36, 0.25)', to: 'rgba(253, 224, 71, 0.25)' },
        dark: { from: 'rgba(245, 158, 11, 0.15)', mid: 'rgba(251, 146, 60, 0.25)', to: 'rgba(251, 191, 36, 0.25)' },
        glow: 'rgba(251, 146, 60, 0.08)',
        glowHover: 'rgba(251, 146, 60, 0.12)',
        shadow: 'rgba(251, 146, 60, 0.15)'
      }
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-sidebar-accent/30 via-transparent to-transparent border-b border-sidebar-border/50">
      {/* Decorative background elements matching SidebarHeader */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
      
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
          opacity: 1;
          animation: glow-pulse 2s ease-in-out infinite;
          transition: opacity 0.4s ease;
        }
        
        .action-btn:hover::after {
          opacity: 1;
        }
        
        .icon-wrapper {
          position: relative;
        }
        
        .icon-wrapper::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
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
        
        /* Indigo theme - Sessions */
        .action-btn-0 {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(165, 180, 252, 0.08));
        }
        
        .dark .action-btn-0 {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(99, 102, 241, 0.18));
        }
        
        .action-btn-0:hover {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(165, 180, 252, 0.16)) !important;
        }
        
        .dark .action-btn-0:hover {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.18), rgba(99, 102, 241, 0.24)) !important;
        }
        
        .action-btn-0::before {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(99, 102, 241, 0.15),
            rgba(129, 140, 248, 0.25),
            rgba(165, 180, 252, 0.25),
            rgba(99, 102, 241, 0.15),
            transparent
          );
        }
        
        .dark .action-btn-0::before {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(79, 70, 229, 0.15),
            rgba(99, 102, 241, 0.25),
            rgba(129, 140, 248, 0.25),
            rgba(79, 70, 229, 0.15),
            transparent
          );
        }
        
        .action-btn-0::after {
          background: radial-gradient(
            circle at center,
            rgba(99, 102, 241, 0.08),
            transparent 70%
          );
        }
        
        .action-btn-0:hover::after {
          background: radial-gradient(
            circle at center,
            rgba(99, 102, 241, 0.12),
            transparent 70%
          );
        }
        
        .icon-wrapper-0::before {
          background: conic-gradient(
            from 0deg,
            transparent,
            rgba(99, 102, 241, 0.15),
            rgba(129, 140, 248, 0.25),
            rgba(165, 180, 252, 0.25),
            rgba(99, 102, 241, 0.15),
            transparent
          );
        }
        
        .dark .icon-wrapper-0::before {
          background: conic-gradient(
            from 0deg,
            transparent,
            rgba(79, 70, 229, 0.15),
            rgba(99, 102, 241, 0.25),
            rgba(129, 140, 248, 0.25),
            rgba(79, 70, 229, 0.15),
            transparent
          );
        }
        
        /* Emerald theme - Tasks */
        .action-btn-1 {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(110, 231, 183, 0.08));
        }
        
        .dark .action-btn-1 {
          background: linear-gradient(135deg, rgba(5, 150, 105, 0.12), rgba(16, 185, 129, 0.18));
        }
        
        .action-btn-1:hover {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(110, 231, 183, 0.16)) !important;
        }
        
        .dark .action-btn-1:hover {
          background: linear-gradient(135deg, rgba(5, 150, 105, 0.18), rgba(16, 185, 129, 0.24)) !important;
        }
        
        .action-btn-1::before {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(16, 185, 129, 0.15),
            rgba(52, 211, 153, 0.25),
            rgba(110, 231, 183, 0.25),
            rgba(16, 185, 129, 0.15),
            transparent
          );
        }
        
        .dark .action-btn-1::before {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(5, 150, 105, 0.15),
            rgba(16, 185, 129, 0.25),
            rgba(52, 211, 153, 0.25),
            rgba(5, 150, 105, 0.15),
            transparent
          );
        }
        
        .action-btn-1::after {
          background: radial-gradient(
            circle at center,
            rgba(16, 185, 129, 0.08),
            transparent 70%
          );
        }
        
        .action-btn-1:hover::after {
          background: radial-gradient(
            circle at center,
            rgba(16, 185, 129, 0.12),
            transparent 70%
          );
        }
        
        .icon-wrapper-1::before {
          background: conic-gradient(
            from 0deg,
            transparent,
            rgba(16, 185, 129, 0.15),
            rgba(52, 211, 153, 0.25),
            rgba(110, 231, 183, 0.25),
            rgba(16, 185, 129, 0.15),
            transparent
          );
        }
        
        .dark .icon-wrapper-1::before {
          background: conic-gradient(
            from 0deg,
            transparent,
            rgba(5, 150, 105, 0.15),
            rgba(16, 185, 129, 0.25),
            rgba(52, 211, 153, 0.25),
            rgba(5, 150, 105, 0.15),
            transparent
          );
        }
        
        /* Amber theme - Cases */
        .action-btn-2 {
          background: linear-gradient(135deg, rgba(251, 146, 60, 0.06), rgba(253, 224, 71, 0.08));
        }
        
        .dark .action-btn-2 {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(251, 146, 60, 0.18));
        }
        
        .action-btn-2:hover {
          background: linear-gradient(135deg, rgba(251, 146, 60, 0.12), rgba(253, 224, 71, 0.16)) !important;
        }
        
        .dark .action-btn-2:hover {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(251, 146, 60, 0.24)) !important;
        }
        
        .action-btn-2::before {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(251, 146, 60, 0.15),
            rgba(251, 191, 36, 0.25),
            rgba(253, 224, 71, 0.25),
            rgba(251, 146, 60, 0.15),
            transparent
          );
        }
        
        .dark .action-btn-2::before {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(245, 158, 11, 0.15),
            rgba(251, 146, 60, 0.25),
            rgba(251, 191, 36, 0.25),
            rgba(245, 158, 11, 0.15),
            transparent
          );
        }
        
        .action-btn-2::after {
          background: radial-gradient(
            circle at center,
            rgba(251, 146, 60, 0.08),
            transparent 70%
          );
        }
        
        .action-btn-2:hover::after {
          background: radial-gradient(
            circle at center,
            rgba(251, 146, 60, 0.12),
            transparent 70%
          );
        }
        
        .icon-wrapper-2::before {
          background: conic-gradient(
            from 0deg,
            transparent,
            rgba(251, 146, 60, 0.15),
            rgba(251, 191, 36, 0.25),
            rgba(253, 224, 71, 0.25),
            rgba(251, 146, 60, 0.15),
            transparent
          );
        }
        
        .dark .icon-wrapper-2::before {
          background: conic-gradient(
            from 0deg,
            transparent,
            rgba(245, 158, 11, 0.15),
            rgba(251, 146, 60, 0.25),
            rgba(251, 191, 36, 0.25),
            rgba(245, 158, 11, 0.15),
            transparent
          );
        }
      `}</style>
      
      {/* Content with relative positioning to stay above decorative elements */}
      <div className="relative flex items-center justify-center gap-2 gap-x-4 px-2 md:px-6 py-3">
        {quickActions.map((action, index) => {
          const btnClass = `action-btn action-btn-${index}`;
          const iconClass = `icon-wrapper icon-wrapper-${index}`;
          return (
            <button
              key={action.path}
              onClick={() => router.push(action.path)}
              className={`${btnClass} relative flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl transition-all duration-300 group cursor-pointer hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm`}
              style={{
                animationDelay: `${index * 0.15}s`,
                boxShadow: `0 10px 15px -3px ${action.colors.shadow}, 0 4px 6px -4px ${action.colors.shadow}`
              }}
              title={action.label}
            >
              <div className={`${iconClass} relative w-7 h-7 flex items-center justify-center z-10`}>
                <Image 
                  src={action.icon} 
                  alt={action.label}
                  width={36}
                  height={36}
                  className="object-contain opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 relative z-10"
                />
              </div>
              <span className="text-sm font-semibold d group-hover:text-sidebar-foreground transition-all duration-300 relative z-10 group-hover:tracking-wide">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Bottom Accent Line - matching SidebarHeader */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
    </div>
  );
}

export default QuickActionsBar;

import React from 'react';
import { motion } from 'motion/react';
import { DocumentModule } from '../types';

interface TopNavProps {
  currentModule: DocumentModule;
  onSelectModule: (module: DocumentModule) => void;
  onResetSample: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentModule,
  onSelectModule,
  onResetSample,
}) => {
  // Clean typographic tabs without redundant decoration icons
  const navItems: { id: DocumentModule; label: string }[] = [
    {
      id: 'generation',
      label: '方案设置',
    },
    {
      id: 'document',
      label: '标书正文',
    },
    {
      id: 'download',
      label: '下载设置',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/90 backdrop-blur-md border-b border-stone-200/60">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand + Document Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7D54FF] to-[#5523E6] flex items-center justify-center shadow-[0_1px_3px_rgba(100,56,255,0.25)] overflow-hidden">
              <svg width="18" height="18" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M49 14.5C47.8 14 44.5 15.2 43 16.5C40.5 18.7 39.2 21.2 38 23C35 22.8 30.5 24.2 26 27.5C23.2 29.5 21 32.5 19 36C18.2 37.4 16.5 41 15 44C17.5 42.5 20.5 41.2 23 40.5C22.2 42.8 20.8 45.8 19 48.5C18.2 49.7 17 51.5 15.5 53C18 52 21 50.5 23.5 49C22.8 51.2 21.8 54 20 56.5C23 54.5 26.5 51.5 29 48C31 45.2 32.5 42 34 38.5C36 39 38 38.5 40 37C42.5 35 44 32 45.5 28.5C47.5 24 50 19 51.5 16C51.8 15.4 51.5 14.8 50.5 14.6L49 14.5Z" fill="#FFFFFF"/>
              </svg>
            </div>
            <span className="font-bold text-[15px] text-stone-900 tracking-tight">喜鹊 AI 标书</span>
          </div>

          <div className="h-3.5 w-px bg-stone-300/80 hidden sm:block" />

          <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-500 truncate">
            <span className="truncate">
              云栖科创中心办公楼物业服务项目
            </span>
          </div>
        </div>

        {/* Center: Tactile Segmented Navigation (Clean typographic pills) */}
        <nav className="relative flex items-center p-1 rounded-xl bg-stone-200/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
          {navItems.map((item) => {
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onSelectModule(item.id)}
                className={`relative z-10 px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer select-none ${
                  isActive
                    ? 'text-stone-900 font-semibold'
                    : 'text-stone-500 hover:text-stone-800 font-medium'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_1px_rgba(0,0,0,0.04)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-20 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Understated Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetSample}
            title="重置为初始标书内容"
            className="px-2.5 py-1.5 text-xs text-stone-500 hover:text-stone-800 hover:bg-stone-200/50 rounded-lg transition-colors cursor-pointer"
          >
            <span>重置正文</span>
          </button>
        </div>
      </div>
    </header>
  );
};

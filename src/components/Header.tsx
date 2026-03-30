"use client";

import { formatDateHebrew } from "@/lib/utils";

interface HeaderProps {
  date: string;
  onShowStats: () => void;
  onShowHelp: () => void;
}

export default function Header({ date, onShowStats, onShowHelp }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      <button
        onClick={onShowHelp}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100"
        aria-label="איך לשחק"
      >
        ?
      </button>
      <div className="text-center">
        <h1 className="text-2xl font-bold">חיבורים</h1>
        <p className="text-xs text-gray-500">{formatDateHebrew(date)}</p>
      </div>
      <button
        onClick={onShowStats}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100"
        aria-label="סטטיסטיקות"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="8" width="3" height="7" rx="0.5" fill="currentColor" />
          <rect x="6" y="4" width="3" height="11" rx="0.5" fill="currentColor" />
          <rect x="11" y="1" width="3" height="14" rx="0.5" fill="currentColor" />
        </svg>
      </button>
    </header>
  );
}

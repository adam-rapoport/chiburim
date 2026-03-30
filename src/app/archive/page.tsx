"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getArchiveDates } from "@/lib/puzzles";
import { getTodayDateIST, formatDateHebrew } from "@/lib/utils";

export default function ArchivePage() {
  const [dates, setDates] = useState<string[]>([]);
  const [today, setToday] = useState("");

  useEffect(() => {
    const todayStr = getTodayDateIST();
    setToday(todayStr);
    setDates(getArchiveDates(todayStr).reverse()); // newest first
  }, []);

  return (
    <div className="max-w-[500px] w-full mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <Link
          href="/"
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100"
          aria-label="חזרה"
        >
          →
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold">ארכיון</h1>
          <p className="text-xs text-gray-500">חידות קודמות</p>
        </div>
        <div className="w-8" /> {/* spacer */}
      </header>

      {/* Puzzle list */}
      <div className="px-4 py-4 space-y-2">
        {dates.length === 0 && (
          <p className="text-center text-gray-400 py-8">טוען...</p>
        )}
        {dates.map((date) => {
          const isToday = date === today;
          return (
            <Link
              key={date}
              href={isToday ? "/" : `/play/${date}`}
              className="flex items-center justify-between px-4 py-3 rounded-lg
                bg-[#EFEFE6] hover:bg-[#E5E5DC] transition-colors"
            >
              <div>
                <p className="font-medium text-sm">
                  {formatDateHebrew(date)}
                </p>
                {isToday && (
                  <span className="text-xs text-green-600 font-medium">
                    החידה של היום
                  </span>
                )}
              </div>
              <span className="text-gray-400 text-lg">←</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

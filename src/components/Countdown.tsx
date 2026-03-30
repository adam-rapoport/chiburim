"use client";

import { useEffect, useState } from "react";

/** Calculate milliseconds until midnight Israel Standard Time */
function msUntilMidnightIST(): number {
  const now = new Date();
  // Get current time in Israel
  const israelNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" })
  );
  // Next midnight in Israel
  const midnight = new Date(israelNow);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);

  // Difference (approximate, but close enough for a countdown)
  return midnight.getTime() - israelNow.getTime();
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Countdown() {
  const [remaining, setRemaining] = useState(msUntilMidnightIST());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(msUntilMidnightIST());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-2">
      <p className="text-xs text-gray-400">החידה הבאה בעוד</p>
      <p className="text-lg font-mono font-bold text-[#5A594E] tracking-wider" dir="ltr">
        {formatTime(remaining)}
      </p>
    </div>
  );
}

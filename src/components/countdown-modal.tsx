'use client';
import React, { useEffect, useState } from "react";

function getNextOpeningTime() {
  const now = new Date();
  const openHour = 18; // 6pm (for testing)
  const closeHour = 2; // 2am (next day)
  const open = new Date(now);
  const close = new Date(now);
  open.setHours(openHour, 0, 0, 0);
  close.setHours(closeHour, 0, 0, 0);
  if (closeHour < openHour) close.setDate(close.getDate() + 1);

  if (now >= open && now < close) {
    // Currently open
    return null;
  }
  if (now < open) {
    return open;
  }
  // After close, next open is tomorrow 8pm
  open.setDate(open.getDate() + 1);
  return open;
}

function getTimeDiff(target: Date) {
  const now = new Date();
  let diff = Math.max(0, target.getTime() - now.getTime());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 1000 * 60 * 60;
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * 1000 * 60;
  const seconds = Math.floor(diff / 1000);
  return { hours, minutes, seconds };
}

const CountdownRibbon: React.FC = () => {
  const [nextOpen] = useState<Date | null>(getNextOpeningTime());
  const [timeLeft, setTimeLeft] = useState(() =>
    nextOpen ? getTimeDiff(nextOpen) : { hours: 0, minutes: 0, seconds: 0 }
  );

  useEffect(() => {
    if (!nextOpen) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(getTimeDiff(nextOpen));
    }, 1000);
    return () => clearInterval(interval);
  }, [nextOpen]);

  if (!nextOpen) return null;

  const message = `Ordering is available from 6:00 PM to 2:00 AM. Opens in ${String(timeLeft.hours).padStart(2, "0")}:${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`;

  return (
    <div
      className="w-full bg-yellow-400 text-black py-1 border-b border-yellow-500 z-40 flex items-center justify-center"
      style={{ position: 'relative', minHeight: 32 }}
    >
      <span className="font-semibold text-sm text-center px-4">{message}</span>
    </div>
  );
};

export default CountdownRibbon;

"use client";
import React, { useEffect, useState } from "react";

function getNextOpeningTime() {
  const now = new Date();
  const openHour = 18; // 6pm
  const closeHour = 2; // 2am (next day)

  const start = new Date(now);
  const end = new Date(now);
  start.setHours(openHour, 0, 0, 0);
  end.setHours(closeHour, 0, 0, 0);

  // Align start/end around 'now' for windows crossing midnight
  if (closeHour <= openHour) {
    if (now < start) {
      // After midnight, before today's opening
      // Current window (yesterday 6pm -> today 2am) already ended; next open is today 6pm
      // 'start' already points to today 6pm
    } else {
      // Evening: closing is next day
      end.setDate(end.getDate() + 1);
    }
  }

  // If currently within the window, no countdown
  if (now >= start && now < end) {
    return null;
  }

  // Not within window: determine next opening
  if (now < start) {
    // Before opening today
    return start;
  }

  // After today's opening window -> next is tomorrow's opening
  start.setDate(start.getDate() + 1);
  return start;
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
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [nextOpen, setNextOpen] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setIsMounted(true);
    const nextOpenTime = getNextOpeningTime();
    setNextOpen(nextOpenTime);

    if (nextOpenTime) {
      setTimeLeft(getTimeDiff(nextOpenTime));
    }
  }, []);

  useEffect(() => {
    if (!isMounted || !nextOpen) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(getTimeDiff(nextOpen));
    }, 1000);

    return () => clearInterval(interval);
  }, [nextOpen, isMounted]);

  if (!isMounted) {
    return null;
  }

  if (!nextOpen || !isVisible) return null;

  const message = `Ordering is available from 6:00 PM to 2:00 AM. Opens in ${String(
    timeLeft.hours
  ).padStart(2, "0")}:${String(timeLeft.minutes).padStart(2, "0")}:${String(
    timeLeft.seconds
  ).padStart(2, "0")}`;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 w-full bg-primary text-black py-1 flex items-center justify-center"
      style={{ position: "relative", minHeight: 32 }}
    >
      <span className="font-semibold text-sm text-center px-4 text-white">
        {message}
      </span>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 text-black hover:text-gray-700 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};

export default CountdownRibbon;

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';

export default function DigitalClock({
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  showDate = true,
  format24h = true,
  fontFamily = 'monospace',
  isAlarmActive = false,
}) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(null);
  const { theme, setTheme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
  }, []);

  const updateTime = useCallback(() => {
    setTime(new Date());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [updateTime, mounted]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const formatTime = (date) => {
    if (!date) return '';
    if (format24h) {
      return date.toLocaleTimeString('en-US', { timeZone: timezone, hour12: false });
    } else {
      const time = date.toLocaleTimeString('en-US', { timeZone: timezone, hour12: true });
      const [timeStr, period] = time.split(' ');
      return { time: timeStr, period: period.toLowerCase() };
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { timeZone: timezone });
  };

  if (!mounted) {
    return (
      <div className="h-screen bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 transition-colors duration-200 flex flex-col">
        <div className="h-[10vh] bg-gray-800 dark:bg-gray-200 flex items-center justify-center">
          <p className="text-sm">Ad Space</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-6xl font-bold animate-pulse">
            Loading...
          </div>
        </div>
        <div className="h-[10vh] bg-gray-800 dark:bg-gray-200 flex items-center justify-center">
          <p className="text-sm">Ad Space</p>
        </div>
      </div>
    );
  }

  const timeDisplay = format24h ? formatTime(time) : formatTime(time).time;
  const periodDisplay = format24h ? null : formatTime(time).period;

  return (
    <div className={`h-screen transition-colors duration-200 flex flex-col ${
      isAlarmActive 
        ? 'bg-red-900 text-white' 
        : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
    }`}>
      {/* Top ad banner */}
      <div className={`h-[10vh] flex items-center justify-center ${
        isAlarmActive ? 'bg-red-800' : 'bg-gray-800 dark:bg-gray-200'
      }`}>
        <p className="text-sm">Ad Space</p>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center relative">
          <div className="flex items-center justify-center">
            <div
              className={`text-[20vw] font-bold leading-none ${
                isAlarmActive ? 'text-white' : ''
              }`}
              style={{ fontFamily }}
            >
              {timeDisplay}
            </div>
            {periodDisplay && (
              <div
                className={`text-[6vw] ml-2 leading-none ${
                  isAlarmActive ? 'text-white' : ''
                }`}
                style={{ fontFamily }}
              >
                {periodDisplay}
              </div>
            )}
          </div>

          {showDate && (
            <div className={`text-[5vw] mt-4 ${
              isAlarmActive ? 'text-white' : ''
            }`}>
              {formatDate(time)}
            </div>
          )}
        </div>
      </main>

      {/* Bottom ad banner */}
      <div className={`h-[10vh] flex items-center justify-center ${
        isAlarmActive ? 'bg-red-800' : 'bg-gray-800 dark:bg-gray-200'
      }`}>
        <p className="text-sm">Ad Space</p>
      </div>
    </div>
  );
} 
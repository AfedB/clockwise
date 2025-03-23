"use client";

import { useState, useEffect, useRef } from "react";

const TIMEZONES = Intl.supportedValuesOf("timeZone");

export default function ClockSettings({
  onTimezoneChange,
  onFormatChange,
  onShowDateChange,
  onFullscreenChange,
  onAlarmChange,
  currentTimezone,
  format24h,
  showDate,
  isFullscreen,
  isAlarmActive,
  alarmTime,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialisation avec préférence de localStorage
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Utiliser la préférence enregistrée ou système
    const isDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Fonction toggle simplifiée
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {isOpen && (
        <div
          ref={dialogRef}
          className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl w-64 z-50"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Time Zone
              </label>
              <select
                value={currentTimezone}
                onChange={(e) => onTimezoneChange(e.target.value)}
                className="w-full p-2 rounded border dark:bg-gray-700"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Time Format
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="24h"
                  checked={format24h}
                  onChange={() => onFormatChange(true)}
                  className="cursor-pointer"
                />
                <label htmlFor="24h" className="cursor-pointer">
                  24h
                </label>
                <input
                  type="radio"
                  id="12h"
                  checked={!format24h}
                  onChange={() => onFormatChange(false)}
                  className="cursor-pointer"
                />
                <label htmlFor="12h" className="cursor-pointer">
                  12h
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showDate"
                checked={showDate}
                onChange={(e) => onShowDateChange(e.target.checked)}
                className="cursor-pointer"
              />
              <label htmlFor="showDate" className="cursor-pointer">
                Show Date
              </label>
            </div>

            <div className="w-full mt-2">
              <button
                onClick={toggleDarkMode}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                {isDarkMode 
                  ? "☀️ Mode Clair" 
                  : "🌙 Mode Sombre"}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="fullscreen"
                checked={isFullscreen}
                onChange={onFullscreenChange}
                className="cursor-pointer"
              />
              <label htmlFor="fullscreen" className="cursor-pointer">
                Fullscreen
              </label>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Alarm</h3>
              <div className="space-y-2">
                <input
                  type="time"
                  value={alarmTime || ""}
                  onChange={(e) => onAlarmChange(e.target.value)}
                  className="w-full p-2 rounded border dark:bg-gray-700"
                />
                {isAlarmActive && (
                  <button
                    onClick={() => onAlarmChange(null)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded p-2"
                  >
                    Stop Alarm
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

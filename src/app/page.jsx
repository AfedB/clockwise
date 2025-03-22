'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import DigitalClock from '@/components/DigitalClock';
import ClockSettings from '@/components/ClockSettings';

export default function Home() {
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [format24h, setFormat24h] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [alarmTime, setAlarmTime] = useState('');
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  useEffect(() => {
    let alarmInterval;

    if (alarmTime && !isAlarmActive) {
      alarmInterval = setInterval(() => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', {
          timeZone: timezone,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        });
        
        if (currentTime === alarmTime) {
          setIsAlarmActive(true);
        }
      }, 1000);
    }

    return () => {
      if (alarmInterval) {
        clearInterval(alarmInterval);
      }
    };
  }, [alarmTime, timezone, isAlarmActive]);

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleAlarmChange = (time) => {
    if (time) {
      setAlarmTime(time);
      setIsAlarmActive(false);
    } else {
      setAlarmTime('');
      setIsAlarmActive(false);
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen">
        <DigitalClock
          timezone={timezone}
          showDate={showDate}
          format24h={format24h}
          fontFamily={fontFamily}
          isAlarmActive={isAlarmActive}
        />
        <ClockSettings
          currentTimezone={timezone}
          onTimezoneChange={setTimezone}
          format24h={format24h}
          onFormatChange={setFormat24h}
          showDate={showDate}
          onShowDateChange={setShowDate}
          currentFont={fontFamily}
          onFontChange={setFontFamily}
          onThemeChange={(theme) => document.documentElement.classList.toggle('dark', theme === 'dark')}
          onFullscreenChange={handleFullscreenChange}
          onAlarmChange={handleAlarmChange}
          theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
          isFullscreen={isFullscreen}
          isAlarmActive={isAlarmActive}
          alarmTime={alarmTime}
        />
      </div>
    </ThemeProvider>
  );
} 
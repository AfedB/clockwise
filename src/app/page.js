'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
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
  const [alarmIntensity, setAlarmIntensity] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // S'assurer que le code côté client est exécuté après le montage
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let alarmInterval;

    if (alarmTime) {
      alarmInterval = setInterval(() => {
        const now = new Date();
        
        // Format actuel pour correspondre au format de l'alarme
        const currentHours = now.getHours().toString().padStart(2, '0');
        const currentMinutes = now.getMinutes().toString().padStart(2, '0');
        const currentHM = `${currentHours}:${currentMinutes}`;
        
        // Nombre total de secondes de l'heure actuelle
        const currentSeconds = now.getSeconds();
        const totalCurrentSeconds = parseInt(currentHours) * 3600 + parseInt(currentMinutes) * 60 + currentSeconds;
        
        // Nombre total de secondes de l'alarme
        const [alarmHours, alarmMinutes] = alarmTime.split(':').map(Number);
        const totalAlarmSeconds = alarmHours * 3600 + alarmMinutes * 60;
        
        // Différence en secondes (avec gestion du passage à minuit)
        let secondsDiff = totalAlarmSeconds - totalCurrentSeconds;
        if (secondsDiff < 0) secondsDiff += 24 * 3600; // Si l'alarme est pour le lendemain
        
        // 10 secondes avant l'alarme - commencer la transition progressive
        if (secondsDiff <= 10 && secondsDiff > 0) {
          // Intensité de 0 à 10 (10 = max)
          setAlarmIntensity(10 - secondsDiff);
          setIsAlarmActive(true);
        } 
        // À l'heure exacte de l'alarme
        else if (currentHM === alarmTime && currentSeconds === 0) {
          setAlarmIntensity(10); // Intensité maximale
          setIsAlarmActive(true);
          // Notification au besoin
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Alarme !', {
              body: `Il est ${alarmTime}`,
              icon: '/clock-icon.png'
            });
          }
        }
      }, 1000);
    }

    return () => {
      if (alarmInterval) {
        clearInterval(alarmInterval);
      }
    };
  }, [alarmTime, timezone]);

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
      setAlarmIntensity(0);
      
      // Demander la permission pour les notifications
      if ('Notification' in window) {
        Notification.requestPermission();
      }
    } else {
      setAlarmTime('');
      setIsAlarmActive(false);
      setAlarmIntensity(0);
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ClockContent 
        timezone={timezone}
        format24h={format24h}
        showDate={showDate}
        setTimezone={setTimezone}
        setFormat24h={setFormat24h}
        setShowDate={setShowDate}
        fontFamily={fontFamily}
        isAlarmActive={isAlarmActive}
        alarmIntensity={alarmIntensity}
        isFullscreen={isFullscreen}
        alarmTime={alarmTime}
        handleFullscreenChange={handleFullscreenChange}
        handleAlarmChange={handleAlarmChange}
      />
    </ThemeProvider>
  );
}

// Composant enfant qui utilise useTheme correctement
function ClockContent(props) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };
  
  // Style pour la couleur de fond qui s'intensifie
  const backgroundStyle = props.isAlarmActive 
    ? { 
        background: `rgba(220, 38, 38, ${props.alarmIntensity / 10})`, 
        transition: 'background 1s ease' 
      } 
    : {};
  
  if (!mounted) return null; // Éviter le flash pendant l'hydratation
  
  return (
    <div className="min-h-screen relative" style={backgroundStyle}>
      <DigitalClock
        timezone={props.timezone}
        showDate={props.showDate}
        format24h={props.format24h}
        fontFamily={props.fontFamily}
        isAlarmActive={props.isAlarmActive}
        alarmIntensity={props.alarmIntensity}
      />
      <ClockSettings
        currentTimezone={props.timezone}
        onTimezoneChange={props.setTimezone}
        format24h={props.format24h}
        onFormatChange={props.setFormat24h}
        showDate={props.showDate}
        onShowDateChange={props.setShowDate}
        currentFont={props.fontFamily}
        onFontChange={props.setFontFamily}
        onThemeChange={handleThemeChange}
        theme={theme} // Utiliser directement le thème de useTheme()
        isFullscreen={props.isFullscreen}
        onFullscreenChange={props.handleFullscreenChange}
        isAlarmActive={props.isAlarmActive}
        alarmTime={props.alarmTime}
        onAlarmChange={props.handleAlarmChange}
      />
    </div>
  );
}
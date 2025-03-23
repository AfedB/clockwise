"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

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
  const [mounted, setMounted] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [isBlinking, setIsBlinking] = useState(isAlarmActive);
  const { theme, setTheme } = useTheme();

  // Initialisation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effet pour gérer le clignotement lorsque l'alarme est active
  useEffect(() => {
    let blinkInterval;
    
    if (isAlarmActive) {
      setIsBlinking(true);
      blinkInterval = setInterval(() => {
        setIsBlinking(prev => !prev);
      }, 500);
    } else {
      setIsBlinking(false);
    }
    
    return () => {
      if (blinkInterval) clearInterval(blinkInterval);
    };
  }, [isAlarmActive]);

  // Ajouter cette fonction useEffect après les autres useEffect
  useEffect(() => {
    // Vérifie si une alarme est définie lors d'un changement de fuseau horaire
    if (alarmTime) {
      onAlarmChange(null); // Annule l'alarme existante
      setConfirmationVisible(true);
      // Affiche une notification discrète
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Timezone Change', {
          body: 'Your alarm has been cancelled. Please set a new alarm for the current timezone.',
          icon: '/clock-icon.png' // Assurez-vous d'avoir une icône ou retirez cette ligne
        });
      }
      
      setTimeout(() => {
        setConfirmationVisible(false);
      }, 3000);
    }
  }, [currentTimezone]); // Se déclenche à chaque changement de fuseau horaire

  // Fonction toggle simplifiée
  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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

  // Fonction pour définir l'alarme avec confirmation
  const handleSetAlarm = (time) => {
    if (!time) return;
    
    onAlarmChange(time);
    setConfirmationVisible(true);
    
    // Masquer la confirmation après 3 secondes
    setTimeout(() => setConfirmationVisible(false), 3000);
    
    // Demander la permission pour les notifications
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary/90 hover:bg-primary/80 text-primary-foreground rounded-full p-3 shadow-lg backdrop-blur-sm transition-all duration-300"
      >
        ⚙️
      </button>

      {isOpen && (
        <div
          ref={dialogRef}
          className="absolute bottom-16 right-0 backdrop-blur-md bg-background/75 p-4 rounded-lg shadow-xl w-64 z-50 text-foreground border border-border/40 ring-1 ring-primary/10 transition-all duration-300"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Time Zone
              </label>
              <select
                value={currentTimezone}
                onChange={(e) => onTimezoneChange(e.target.value)}
                className="w-full p-2 rounded border border-border/40 bg-muted/60 text-foreground backdrop-blur-sm ring-1 ring-primary/5 transition-colors"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Format transformé en boutons toggle */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Time Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onFormatChange(true)}
                  className={`p-2 rounded text-center transition-all duration-200 ${
                    format24h 
                      ? "bg-primary/80 text-primary-foreground ring-2 ring-primary/50" 
                      : "bg-muted/50 text-muted-foreground backdrop-blur-sm"
                  } border border-border/20`}
                >
                  24h
                </button>
                <button
                  onClick={() => onFormatChange(false)}
                  className={`p-2 rounded text-center transition-all duration-200 ${
                    !format24h 
                      ? "bg-primary/80 text-primary-foreground ring-2 ring-primary/50" 
                      : "bg-muted/50 text-muted-foreground backdrop-blur-sm"
                  } border border-border/20`}
                >
                  12h
                </button>
              </div>
            </div>

            {/* Show Date transformé en bouton toggle */}
            <div>
              <button
                onClick={() => onShowDateChange(!showDate)}
                className={`w-full p-2 rounded flex items-center justify-between transition-all duration-200 ${
                  showDate 
                    ? "bg-primary/80 text-primary-foreground" 
                    : "bg-muted/50 text-muted-foreground"
                } backdrop-blur-sm border border-border/20`}
              >
                <span>Show Date</span>
                <span className="text-sm">
                  {showDate ? "✓ ON" : "OFF"}
                </span>
              </button>
            </div>

            {/* Dark Mode button (already modernized) */}
            <div className="w-full">
              <button
                onClick={toggleDarkMode}
                className="w-full p-2 rounded bg-secondary/80 hover:bg-secondary/90 backdrop-blur-sm transition-colors border border-border/20 ring-1 ring-primary/5 flex items-center justify-between"
              >
                <span>{theme === 'dark' ? "Light Mode" : "Dark Mode"}</span>
                <span>{theme === 'dark' ? "☀️" : "🌙"}</span>
              </button>
            </div>

            {/* Fullscreen transformé en bouton toggle */}
            <div>
              <button
                onClick={onFullscreenChange}
                className={`w-full p-2 rounded flex items-center justify-between transition-all duration-200 ${
                  isFullscreen 
                    ? "bg-primary/80 text-primary-foreground" 
                    : "bg-muted/50 text-muted-foreground"
                } backdrop-blur-sm border border-border/20`}
              >
                <span>Fullscreen</span>
                <span className="text-sm">
                  {isFullscreen ? "✓ ON" : "OFF"}
                </span>
              </button>
            </div>

            <div className="border-t border-border/40 pt-4">
              <h3 className="text-sm font-medium mb-2">
                Alarm
                {alarmTime && !isAlarmActive && (
                  <span className="ml-2 text-sm font-normal text-primary/90">
                    (✅ {alarmTime.substring(0, 5)})
                  </span>
                )}
              </h3>
              <div className="space-y-2">
                <input
                  type="time"
                  value={alarmTime || ""}
                  onChange={(e) => e.target.value && handleSetAlarm(e.target.value)}
                  className="w-full p-2 rounded border border-border/40 bg-muted/60 text-foreground backdrop-blur-sm ring-1 ring-primary/5 transition-colors"
                  disabled={isAlarmActive}
                />
                
                {!isAlarmActive && alarmTime ? (
                  <button
                    onClick={() => onAlarmChange(null)}
                    className="w-full bg-muted/70 hover:bg-muted/90 text-muted-foreground rounded p-2 backdrop-blur-sm border border-border/20 transition-colors"
                  >
                    Cancel Alarm
                  </button>
                ) : isAlarmActive ? (
                  <button
                    onClick={() => onAlarmChange(null)}
                    className="w-full bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded p-2 animate-pulse backdrop-blur-sm border border-destructive/20 transition-colors"
                  >
                    Stop Alarm
                  </button>
                ) : (
                  <button
                    onClick={() => alarmTime && handleSetAlarm(alarmTime)}
                    className="w-full bg-primary/80 hover:bg-primary/90 text-primary-foreground rounded p-2 backdrop-blur-sm border border-primary/20 transition-colors"
                    disabled={!alarmTime}
                  >
                    Set Alarm
                  </button>
                )}
                
                {confirmationVisible && (
                  <div className="mt-2 p-2 bg-primary/60 backdrop-blur-sm text-primary-foreground rounded text-center text-sm border border-primary/20 ring-1 ring-primary/10 transition-all duration-300">
                    {alarmTime 
                      ? `Alarm set for ${alarmTime?.substring(0, 5)}`
                      : "Alarm cancelled due to timezone change"}
                  </div>
                )}                
              
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

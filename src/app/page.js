"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import DigitalClock from "@/components/DigitalClock";
import ClockSettings from "@/components/ClockSettings";

function ClockContent(props) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculer la classe de couleur de fond en fonction de l'alarme
  const getBgColorClass = () => {
    if (!props.isAlarmActive) {
      return "bg-background";
    }

    const intensity = props.alarmIntensity;
    
    // Mapper l'intensité à des classes d'opacité pour la couleur destructive
    const intensityMap = {
      0: "bg-destructive/10",
      1: "bg-destructive/20",
      2: "bg-destructive/30",
      3: "bg-destructive/40",
      4: "bg-destructive/50",
      5: "bg-destructive/60",
      6: "bg-destructive/70",
      7: "bg-destructive/80",
      8: "bg-destructive/90",
      9: "bg-destructive",
      10: "bg-destructive",
    };

    return intensityMap[Math.round(intensity)] || "bg-destructive";
  };

  // Calculer la classe de couleur du texte en fonction de l'alarme
  const getTextColorClass = () => {
    if (!props.isAlarmActive) {
      return "text-foreground";
    }
    
    // Pendant l'alarme, utiliser la couleur de texte de destructive
    return "text-destructive-foreground";
  };

  // Fix hydration issue - early return if not mounted
  if (!mounted) return null;

  const bgColorClass = getBgColorClass();
  const textColorClass = getTextColorClass();

  return (
    <div
      className={`relative ${bgColorClass} ${textColorClass} rounded-lg shadow-lg`}
    >
      <div className="relative z-10">
        <DigitalClock
          timezone={props.timezone}
          showDate={props.showDate}
          format24h={props.format24h}
          fontFamily={props.fontFamily}
          isAlarmActive={props.isAlarmActive}
          alarmIntensity={props.alarmIntensity}
          alarmTime={props.alarmTime}
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
          isFullscreen={props.isFullscreen}
          onFullscreenChange={props.handleFullscreenChange}
          isAlarmActive={props.isAlarmActive}
          alarmTime={props.alarmTime}
          onAlarmChange={props.handleAlarmChange}
          onAlarmStateChange={props.handleAlarmStateChange}
        />
      </div>
    </div>
  );
}

// Fonction pour charger les préférences depuis localStorage
const loadPreferences = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const savedPrefs = localStorage.getItem('clockwisePreferences');
    if (savedPrefs) {
      return JSON.parse(savedPrefs);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des préférences:', error);
  }
  return null;
};

// Fonction pour sauvegarder les préférences dans localStorage
const savePreferences = (preferences) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('clockwisePreferences', JSON.stringify(preferences));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des préférences:', error);
  }
};

export default function Home() {
  // État pour contrôler le montage du composant côté client
  const [isMounted, setIsMounted] = useState(false);
  
  // États pour les préférences de l'horloge
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [format24h, setFormat24h] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // États pour l'alarme
  const [alarmTime, setAlarmTime] = useState("");
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [alarmIntensity, setAlarmIntensity] = useState(0);
  const [alarmTimeout, setAlarmTimeout] = useState(null);

  // Charger les préférences au montage du composant
  useEffect(() => {
    setIsMounted(true);
    
    const prefs = loadPreferences();
    if (prefs) {
      if (prefs.timezone) setTimezone(prefs.timezone);
      if (prefs.format24h !== undefined) setFormat24h(prefs.format24h);
      if (prefs.showDate !== undefined) setShowDate(prefs.showDate);
      if (prefs.fontFamily) setFontFamily(prefs.fontFamily);
      if (prefs.alarmTime) setAlarmTime(prefs.alarmTime);
    }
  }, []);

  // Enregistrer les préférences lorsqu'elles changent
  useEffect(() => {
    if (!isMounted) return;
    
    const preferences = {
      timezone,
      format24h,
      showDate,
      fontFamily,
      alarmTime
    };
    
    savePreferences(preferences);
  }, [timezone, format24h, showDate, fontFamily, alarmTime, isMounted]);

  // Gérer l'alarme
  useEffect(() => {
    let alarmInterval;

    if (alarmTime && isMounted) {
      alarmInterval = setInterval(() => {
        const now = new Date();
        const currentHours = now.getHours().toString().padStart(2, "0");
        const currentMinutes = now.getMinutes().toString().padStart(2, "0");
        const currentSeconds = now.getSeconds().toString().padStart(2, "0");
        const currentHM = `${currentHours}:${currentMinutes}`;
        const alarmHM = alarmTime.substring(0, 5);
        
        // Calculer le temps jusqu'à l'alarme en secondes
        const [alarmH, alarmM] = alarmHM.split(':').map(Number);
        const [nowH, nowM, nowS] = [Number(currentHours), Number(currentMinutes), Number(currentSeconds)];
        
        const alarmTotalSeconds = alarmH * 3600 + alarmM * 60;
        const nowTotalSeconds = nowH * 3600 + nowM * 60 + nowS;
        
        // Gérer le cas où l'alarme est pour le jour suivant
        let secondsUntilAlarm = alarmTotalSeconds - nowTotalSeconds;
        if (secondsUntilAlarm < 0) secondsUntilAlarm += 24 * 3600;
        
        // Si moins de 10 secondes avant l'alarme, commencer à augmenter l'intensité
        if (secondsUntilAlarm <= 10 && secondsUntilAlarm > 0) {
          setIsAlarmActive(true);
          const intensity = 10 - secondsUntilAlarm; // 0->10 au fur et à mesure
          setAlarmIntensity(intensity);
        }
        // Si c'est l'heure exacte de l'alarme ou après l'heure d'alarme mais dans la même minute
        else if (currentHM === alarmHM || 
                 (nowH === alarmH && nowM === alarmM && nowS < 30)) {
          setIsAlarmActive(true);
          setAlarmIntensity(10); // Intensité maximale
          
          // Désactiver l'alarme après 60 secondes
          if (!alarmTimeout) {
            const timeout = setTimeout(() => {
              setIsAlarmActive(false);
              setAlarmIntensity(0);
              setAlarmTimeout(null);
            }, 60000);
            setAlarmTimeout(timeout);
          }
        } else {
          // Si l'alarme n'est pas active et qu'on n'est pas dans les 10 secondes précédentes
          if (secondsUntilAlarm > 10 && isAlarmActive) {
            setIsAlarmActive(false);
            setAlarmIntensity(0);
          }
        }
      }, 1000);
    } else if (!alarmTime) {
      // Si l'alarme est désactivée, réinitialiser les états
      setIsAlarmActive(false);
      setAlarmIntensity(0);
      
      // Effacer le timeout s'il existe
      if (alarmTimeout) {
        clearTimeout(alarmTimeout);
        setAlarmTimeout(null);
      }
    }

    return () => {
      if (alarmInterval) {
        clearInterval(alarmInterval);
      }
      if (alarmTimeout) {
        clearTimeout(alarmTimeout);
        setAlarmTimeout(null);
      }
    };
  }, [alarmTime, timezone, isMounted, isAlarmActive, alarmTimeout]);

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleAlarmChange = (time) => {
    if (time) {
      setAlarmTime(time);
      setAlarmIntensity(0);
      setIsAlarmActive(false);
      
      // Effacer le timeout existant s'il y en a un
      if (alarmTimeout) {
        clearTimeout(alarmTimeout);
        setAlarmTimeout(null);
      }
    } else {
      // Annuler l'alarme
      setAlarmTime("");
      setIsAlarmActive(false);
      setAlarmIntensity(0);
      
      // Effacer le timeout s'il existe
      if (alarmTimeout) {
        clearTimeout(alarmTimeout);
        setAlarmTimeout(null);
      }
    }
  };

  // Fonction pour gérer les changements d'état d'alarme depuis le composant Alarm
  const handleAlarmStateChange = (isActive, time) => {
    if (time === null || time === "") {
      // Réinitialiser l'alarme complètement
      setAlarmTime("");
      setIsAlarmActive(false);
      setAlarmIntensity(0);
      
      // Effacer le timeout s'il existe
      if (alarmTimeout) {
        clearTimeout(alarmTimeout);
        setAlarmTimeout(null);
      }
    } else if (isActive) {
      // Activer une alarme
      setAlarmTime(time);
      // Vérifier si c'est l'heure actuelle pour décider d'activer l'alarme immédiatement
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, "0");
      const currentMinutes = now.getMinutes().toString().padStart(2, "0");
      const currentHM = `${currentHours}:${currentMinutes}`;

      if (currentHM === time.substring(0, 5)) {
        // L'heure actuelle correspond à l'heure d'alarme
        setIsAlarmActive(true);
        setAlarmIntensity(10);
      } else {
        // L'alarme est programmée pour plus tard
        setIsAlarmActive(false);
        setAlarmIntensity(0);
      }
    } else {
      // Définir une nouvelle alarme (non active)
      setAlarmTime(time);
      setIsAlarmActive(false);
      setAlarmIntensity(0);
    }
  };

  // Prevent rendering until client-side rendering is ready
  if (!isMounted) return null;

  return (
    <ClockContent
      timezone={timezone}
      format24h={format24h}
      showDate={showDate}
      setTimezone={setTimezone}
      setFormat24h={setFormat24h}
      setShowDate={setShowDate}
      fontFamily={fontFamily}
      setFontFamily={setFontFamily}
      isAlarmActive={isAlarmActive}
      alarmIntensity={alarmIntensity}
      isFullscreen={isFullscreen}
      alarmTime={alarmTime}
      handleFullscreenChange={handleFullscreenChange}
      handleAlarmChange={handleAlarmChange}
      handleAlarmStateChange={handleAlarmStateChange}
    />
  );
}

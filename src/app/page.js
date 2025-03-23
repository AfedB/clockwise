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

export default function Home() {
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [format24h, setFormat24h] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [alarmTime, setAlarmTime] = useState("");
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
          const intensity = 10 - secondsUntilAlarm; // 0->9 au fur et à mesure
          console.log(`Alarm in ${secondsUntilAlarm} seconds. Intensity: ${intensity}`);
          setAlarmIntensity(intensity);
        }
        // Si c'est l'heure exacte de l'alarme
        else if (currentHM === alarmHM) {
          console.log("Alarm triggered!", currentHM, alarmTime);
          setIsAlarmActive(true);
          setAlarmIntensity(10); // Intensité maximale
        }
      }, 1000);
    }

    return () => {
      if (alarmInterval) {
        clearInterval(alarmInterval);
      }
    };
  }, [alarmTime, timezone]);

  useEffect(() => {
    console.log("Alarm status updated:", isAlarmActive, "intensity:", alarmIntensity);
  }, [isAlarmActive, alarmIntensity]);

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
    console.log(`Alarm changed to: ${time}`);
    if (time) {
      setAlarmTime(time);
      setAlarmIntensity(0);

      // Demander la permission pour les notifications
      if ("Notification" in window) {
        Notification.requestPermission();
      }
    } else {
      setAlarmTime("");
      setIsAlarmActive(false);
      setAlarmIntensity(0);
    }
  };

  // Fonction pour gérer les changements d'état d'alarme depuis le composant Alarm
  const handleAlarmStateChange = (isActive, time) => {
    console.log(`Alarm state changed: active=${isActive}, time=${time}`);
    if (time === null || time === "") {
      // Réinitialiser l'alarme complètement
      setAlarmTime("");
      setIsAlarmActive(false);
      setAlarmIntensity(0);
    } else if (isActive) {
      // Activer une alarme
      setAlarmTime(time);
      // Vérifier si c'est l'heure actuelle pour décider d'activer l'alarme immédiatement
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, "0");
      const currentMinutes = now.getMinutes().toString().padStart(2, "0");
      const currentHM = `${currentHours}:${currentMinutes}`;

      if (currentHM === time) {
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
    console.log(
      "Setting alarm active:",
      isAlarmActive,
      "intensity:",
      alarmIntensity
    );
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

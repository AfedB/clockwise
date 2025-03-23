"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "next-themes";

export default function DigitalClock({
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  showDate = true,
  format24h = true,
  isAlarmActive = false,
  alarmTime,
}) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(null);
  const { theme, setTheme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [alarmIntensity, setAlarmIntensity] = useState(0);
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const containerRef = useRef(null);

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

  useEffect(() => {
    const adjustFontSize = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const timeElement = container.querySelector(".time-display");
      const periodElement = container.querySelector(".period-display");

      if (!timeElement || !periodElement) return;

      // Reset font size
      timeElement.style.fontSize = "20vw";
      periodElement.style.fontSize = "3vw";

      // Check if content overflows
      const isOverflowing = container.scrollWidth > container.clientWidth;

      if (isOverflowing) {
        // Gradually reduce font size until it fits
        let timeSize = 20;
        let periodSize = 6;

        while (container.scrollWidth > container.clientWidth && timeSize > 10) {
          timeSize -= 0.5;
          periodSize = timeSize * 0.3; // Maintain ratio

          timeElement.style.fontSize = `${timeSize}vw`;
          periodElement.style.fontSize = `${periodSize}vw`;
        }
      }
    };

    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);
    return () => window.removeEventListener("resize", adjustFontSize);
  }, [time, format24h]);


  useEffect(() => {
    setIsAlarmSet(!!alarmTime);
  }, [alarmTime]);

  useEffect(() => {
    if (isAlarmActive) {
      document.documentElement.style.setProperty(
        "--alarm-opacity",
        alarmIntensity / 10
      );
      document.documentElement.style.setProperty(
        "--current-alarm-color",
        "hsl(var(--destructive))"
      );
    } else {
      document.documentElement.style.setProperty("--alarm-opacity", "0");
    }
  }, [isAlarmActive, alarmIntensity, theme]);

  const getAlarmColor = () => {
    if (!isAlarmActive) return "bg-background";

    // Mapper l'intensité (0-10) à des classes d'opacité pour la couleur destructive
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
      10: "bg-destructive", // Intensité maximale
    };

    return intensityMap[Math.round(alarmIntensity)] || "bg-destructive";
  };

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
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const formatTime = (date) => {
    if (!date) return "";
    if (format24h) {
      return date.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour12: false,
      });
    } else {
      const time = date.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour12: true,
      });
      const [timeStr, period] = time.split(" ");
      return { time: timeStr, period: period.toLowerCase() };
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { timeZone: timezone });
  };

  if (!mounted) {
    return (
      <div className="h-screen bg-background text-foreground transition-colors duration-200 flex flex-col">
        <div className="h-[10vh] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Ad Space</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-6xl font-bold animate-pulse">Loading...</div>
        </div>
        <div className="h-[10vh] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Ad Space</p>
        </div>
      </div>
    );
  }

  const timeDisplay = format24h ? formatTime(time) : formatTime(time).time;
  const periodDisplay = format24h ? null : formatTime(time).period;

  return (
    <div className={`min-h-screen flex flex-col ${getAlarmColor()}`}>
      {/* Top ad banner */}
      <div
        className={`h-[10vh] flex items-center justify-center ${
          isAlarmActive
            ? getAlarmColor()
            : "bg-muted"
        }`}
      >
        <p className="text-sm text-muted-foreground">Ad Space</p>
      </div>

      {/* Main content */}
      <main className="flex-1 relative">
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-4"
          ref={containerRef}
        >
          <div className="margin-auto relative">
            <div
              className={`time-display font-bold leading-none ${
                isAlarmActive ? "text-destructive-foreground" : "text-foreground"
              }`}
              style={{
                fontSize: "20vw",
                lineHeight: "1",
              }}
            >
              {timeDisplay}
            </div>
            {periodDisplay && (
              <div
                className={`period-display absolute -bottom-4 right-0 transform -translate-y-1/4 translate-x-1/4 ${
                  isAlarmActive ? "text-destructive-foreground" : "text-foreground"
                }`}
                style={{
                  fontSize: "3vw",
                  lineHeight: "1",
                }}
              >
                {periodDisplay}
              </div>
            )}
          </div>

          {showDate && (
            <div
              className={`text-[5vw] mt-4 ${isAlarmActive ? "text-destructive-foreground" : "text-foreground"}`}
            >
              {formatDate(time)}
            </div>
          )}

          {/* Alarm indicators */}
          {isAlarmSet && !isAlarmActive && (
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
              Alarm set for {alarmTime}
            </div>
          )}
          {isAlarmActive && (
            <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm">
              ALARM ACTIVE
            </div>
          )}
        </div>
      </main>

      {/* Bottom ad banner */}
      <div
        className={`h-[10vh] flex items-center justify-center ${
          isAlarmActive ? getAlarmColor() : "bg-muted"
        }`}
      >
        <p className="text-sm text-muted-foreground">Ad Space</p>
      </div>
    </div>
  );
}

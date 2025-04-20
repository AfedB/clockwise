"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function ClientLayout({ children }) {
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  // Écouter les changements de variable CSS pour l'alarme
  useEffect(() => {
    const checkAlarmStatus = () => {
      const alarmOpacity = getComputedStyle(document.documentElement)
        .getPropertyValue('--alarm-opacity')
        .trim();
      
      // Considérer l'alarme comme active si l'opacité est supérieure à 0
      setIsAlarmActive(parseFloat(alarmOpacity) > 0);
    };

    // Vérifier initialement
    checkAlarmStatus();

    // Observer les changements avec MutationObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          checkAlarmStatus();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    // Vérifier périodiquement aussi (pour plus de sûreté)
    const interval = setInterval(checkAlarmStatus, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={cn(
      "min-h-screen bg-background font-sans alarm-overlay",
      isAlarmActive && "alarm-active"
    )}>
      {children}
    </div>
  );
} 
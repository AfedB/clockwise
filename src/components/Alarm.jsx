'use client';

import { useState, useEffect } from 'react';

export default function Alarm({ timezone }) {
  const [alarmTime, setAlarmTime] = useState('');
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let alarmInterval;
    let blinkInterval;

    if (isAlarmActive) {
      alarmInterval = setInterval(() => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('fr-FR', {
          timeZone: timezone,
          hour12: false,
        });
        
        if (currentTime === alarmTime) {
          setIsBlinking(true);
          // Créer une notification si le navigateur le supporte
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Alarme !', {
              body: `Il est ${alarmTime}`,
              icon: '/clock-icon.png'
            });
          }
        }
      }, 1000);

      // Effet de clignotement
      blinkInterval = setInterval(() => {
        setIsBlinking(prev => !prev);
      }, 500);
    }

    return () => {
      if (alarmInterval) {
        clearInterval(alarmInterval);
      }
      if (blinkInterval) {
        clearInterval(blinkInterval);
      }
    };
  }, [isAlarmActive, alarmTime, timezone]);

  const handleSetAlarm = () => {
    setIsAlarmSet(true);
    setIsAlarmActive(true);
    // Demander la permission pour les notifications
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const handleStopAlarm = () => {
    setIsAlarmActive(false);
    setIsBlinking(false);
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2">Alarme</h3>
      <div className="space-y-2">
        <input
          type="time"
          value={alarmTime}
          onChange={(e) => setAlarmTime(e.target.value)}
          className="p-2 rounded border dark:bg-gray-700"
        />
        {!isAlarmSet ? (
          <button
            onClick={handleSetAlarm}
            className="w-full bg-red-500 hover:bg-red-600 text-white rounded p-2"
          >
            Définir l'alarme
          </button>
        ) : (
          <button
            onClick={handleStopAlarm}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded p-2"
          >
            Arrêter l'alarme
          </button>
        )}
        {isBlinking && (
          <div className="mt-2 p-2 bg-red-500 text-white rounded text-center animate-pulse">
            ⏰ ALARME ! ⏰
          </div>
        )}
      </div>
    </div>
  );
} 
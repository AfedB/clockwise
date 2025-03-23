'use client';

import { useState, useEffect } from 'react';

export default function Alarm({ timezone, onAlarmStateChange }) {
  const [alarmTime, setAlarmTime] = useState('');
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [preAlarmCountdown, setPreAlarmCountdown] = useState(0); // 0-10 pour l'intensité
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  useEffect(() => {
    let alarmInterval;
    let blinkInterval;
    let countdownInterval;

    if (isAlarmSet) {
      alarmInterval = setInterval(() => {
        const now = new Date();
        // Extraire les heures et minutes actuelles
        const currentHours = now.toLocaleTimeString('fr-FR', {
          timeZone: timezone,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        });
        
        // Extraire juste HH:MM de l'heure complète
        const alarmHoursMinutes = alarmTime.substring(0, 5);
        
        // Calculer combien de secondes avant l'alarme
        const currentTimeParts = currentHours.split(':');
        const alarmTimeParts = alarmHoursMinutes.split(':');
        
        const currentTotalSeconds = 
          parseInt(currentTimeParts[0]) * 3600 + 
          parseInt(currentTimeParts[1]) * 60 + 
          now.getSeconds();
        
        const alarmTotalSeconds = 
          parseInt(alarmTimeParts[0]) * 3600 + 
          parseInt(alarmTimeParts[1]) * 60;
        
        // Différence en secondes (gestion des passages minuit)
        let diff = alarmTotalSeconds - currentTotalSeconds;
        if (diff < 0) diff += 24 * 3600; // Ajouter 24h si l'alarme est pour le jour suivant
        
        // Pré-alarme 10 secondes avant
        if (diff <= 10 && diff > 0) {
          setPreAlarmCountdown(10 - diff);
          onAlarmStateChange(true, 10 - diff); // Communiquer l'intensité au composant parent
        }
        // Alarme atteinte
        else if (diff === 0 || (currentHours === alarmHoursMinutes && now.getSeconds() === 0)) {
          setIsAlarmActive(true);
          setIsBlinking(true);
          setPreAlarmCountdown(10); // Intensité maximale
          onAlarmStateChange(true, 10);
          
          // Notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Alarme !', {
              body: `Il est ${alarmTime.substring(0, 5)}`,
              icon: '/clock-icon.png'
            });
          }
        }
      }, 1000);

      // Effet de clignotement uniquement quand l'alarme est active
      if (isAlarmActive) {
        blinkInterval = setInterval(() => {
          setIsBlinking(prev => !prev);
        }, 500);
      }
    }

    return () => {
      if (alarmInterval) clearInterval(alarmInterval);
      if (blinkInterval) clearInterval(blinkInterval);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [isAlarmSet, isAlarmActive, alarmTime, timezone, onAlarmStateChange]);

  const handleSetAlarm = () => {
    setIsAlarmSet(true);
    setConfirmationVisible(true);
    // Masquer la confirmation après 3 secondes
    setTimeout(() => setConfirmationVisible(false), 3000);
    
    // Demander la permission pour les notifications
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const handleStopAlarm = () => {
    setIsAlarmActive(false);
    setIsBlinking(false);
    setIsAlarmSet(false);
    setPreAlarmCountdown(0);
    onAlarmStateChange(false, 0); // Réinitialiser l'état d'alarme dans le parent
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
          disabled={isAlarmSet}
        />
        {!isAlarmSet ? (
          <button
            onClick={handleSetAlarm}
            className="w-full bg-red-500 hover:bg-red-600 text-white rounded p-2"
            disabled={!alarmTime}
          >
            Définir l'alarme
          </button>
        ) : (
          <button
            onClick={handleStopAlarm}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded p-2"
          >
            {isAlarmActive ? "Arrêter l'alarme" : "Annuler l'alarme"}
          </button>
        )}
        {confirmationVisible && (
          <div className="mt-2 p-2 bg-green-500 text-white rounded text-center">
            Alarme définie pour {alarmTime.substring(0, 5)}
          </div>
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
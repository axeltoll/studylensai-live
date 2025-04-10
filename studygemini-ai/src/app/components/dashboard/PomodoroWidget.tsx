'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, BellRing, Minimize, Maximize } from 'lucide-react';

interface PomodoroWidgetProps {
  variant?: 'sidebar' | 'dashboard';
}

const PomodoroWidget: React.FC<PomodoroWidgetProps> = ({ 
  variant = 'sidebar'
}) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [completedToday, setCompletedToday] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Load timer state from localStorage on mount
  useEffect(() => {
    const storedTimeLeft = localStorage.getItem('pomodoroTimeLeft');
    const storedIsRunning = localStorage.getItem('pomodoroIsRunning');
    const storedLastUpdated = localStorage.getItem('pomodoroLastUpdated');
    const storedCompletedToday = localStorage.getItem('pomodoroCompletedToday');
    const storedCompletedTimestamps = localStorage.getItem('pomodoroCompletedTimestamps');
    const storedNotificationsEnabled = localStorage.getItem('pomodoroNotificationsEnabled');
    const storedIsExpanded = localStorage.getItem('pomodoroIsExpanded');
    
    if (storedTimeLeft) {
      const parsedTimeLeft = parseInt(storedTimeLeft, 10);
      setTimeLeft(parsedTimeLeft);
    }
    
    if (storedIsRunning) {
      setIsRunning(storedIsRunning === 'true');
    }
    
    if (storedLastUpdated) {
      setLastUpdated(parseInt(storedLastUpdated, 10));
    }

    if (storedNotificationsEnabled) {
      setNotificationsEnabled(storedNotificationsEnabled === 'true');
    }
    
    if (storedIsExpanded) {
      setIsExpanded(storedIsExpanded === 'true');
    }
    
    // Calculate completed pomodoros in the last 24h
    if (storedCompletedTimestamps) {
      try {
        const timestamps = JSON.parse(storedCompletedTimestamps);
        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        const recentCompletions = timestamps.filter((time: number) => time > oneDayAgo);
        setCompletedToday(recentCompletions.length);
        // Update storage to remove old timestamps
        localStorage.setItem('pomodoroCompletedTimestamps', JSON.stringify(recentCompletions));
      } catch (error) {
        console.error('Could not parse completed timestamps:', error);
      }
    } else if (storedCompletedToday) {
      // For backwards compatibility
      setCompletedToday(parseInt(storedCompletedToday, 10));
    }
  }, []);

  // Update timer every second if running
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      // If timer was already running, calculate elapsed time
      if (lastUpdated) {
        const now = Date.now();
        const elapsed = Math.floor((now - lastUpdated) / 1000);
        if (elapsed > 0 && elapsed < timeLeft) {
          setTimeLeft(prevTime => prevTime - elapsed);
        }
      }
      
      // Set current timestamp
      setLastUpdated(Date.now());
      
      // Start interval for countdown
      intervalId = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          
          // Update localStorage
          localStorage.setItem('pomodoroTimeLeft', newTime.toString());
          localStorage.setItem('pomodoroLastUpdated', Date.now().toString());
          
          if (newTime <= 0) {
            setIsRunning(false);
            localStorage.setItem('pomodoroIsRunning', 'false');
            clearInterval(intervalId);
            
            // Record completed pomodoro
            const now = Date.now();
            const storedTimestamps = localStorage.getItem('pomodoroCompletedTimestamps');
            let timestamps = [];
            if (storedTimestamps) {
              try {
                timestamps = JSON.parse(storedTimestamps);
              } catch (error) {
                console.error('Could not parse timestamps:', error);
              }
            }
            timestamps.push(now);
            localStorage.setItem('pomodoroCompletedTimestamps', JSON.stringify(timestamps));
            
            // Update completed count
            const oneDayAgo = now - 24 * 60 * 60 * 1000;
            const recentCompletions = timestamps.filter((time: number) => time > oneDayAgo);
            setCompletedToday(recentCompletions.length);
            
            // Play sound or show notification when timer ends
            try {
              const audio = new Audio('/sounds/timer-end.mp3');
              audio.play();
            } catch (error) {
              console.error('Could not play sound:', error);
            }
            
            // Show browser notification if permission granted
            if (notificationsEnabled) {
              if (Notification.permission === 'granted') {
                new Notification('Pomodoro Timer Completed!', {
                  body: 'Time to take a break!',
                  icon: '/images/logos/StudyLens-Ai-Logo-V1-Square-396-349-Black.png'
                });
              }
            }
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      // Update localStorage
      localStorage.setItem('pomodoroIsRunning', isRunning.toString());
      if (lastUpdated) {
        localStorage.setItem('pomodoroLastUpdated', lastUpdated.toString());
      }
    }

    return () => clearInterval(intervalId);
  }, [isRunning, lastUpdated, notificationsEnabled]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const toggleTimer = () => {
    const newIsRunning = !isRunning;
    setIsRunning(newIsRunning);
    localStorage.setItem('pomodoroIsRunning', newIsRunning.toString());
    setLastUpdated(Date.now());
    localStorage.setItem('pomodoroLastUpdated', Date.now().toString());
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setLastUpdated(null);
    localStorage.setItem('pomodoroIsRunning', 'false');
    localStorage.setItem('pomodoroTimeLeft', (25 * 60).toString());
    localStorage.removeItem('pomodoroLastUpdated');
  };

  // Request notification permission
  const toggleNotifications = () => {
    if (!notificationsEnabled) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          const newEnabled = permission === 'granted';
          setNotificationsEnabled(newEnabled);
          localStorage.setItem('pomodoroNotificationsEnabled', newEnabled.toString());
        });
      } else if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('pomodoroNotificationsEnabled', 'true');
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('pomodoroNotificationsEnabled', 'false');
    }
  };

  // Toggle expanded/collapsed state
  const toggleExpanded = () => {
    const newIsExpanded = !isExpanded;
    setIsExpanded(newIsExpanded);
    localStorage.setItem('pomodoroIsExpanded', newIsExpanded.toString());
  };

  // Different styles for sidebar vs dashboard variant
  const containerClasses = variant === 'sidebar' 
    ? "w-full bg-gray-50 border border-gray-200 rounded-lg"
    : "w-full sm:w-64 p-4 bg-white border border-gray-200 rounded-lg shadow-sm";

  const gradientTextClass = "bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent";

  if (!isExpanded) {
    // Compact view
    return (
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center">
          <div className={`font-semibold text-lg ${gradientTextClass}`}>
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={toggleTimer}
            className={`ml-2 p-1 rounded-full ${
              isRunning 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
            }`}
            aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
        <button
          onClick={toggleExpanded}
          className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
          aria-label="Expand timer"
        >
          <Maximize className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={`${containerClasses} ${variant === 'sidebar' ? 'p-3' : ''}`}>
      <div className="flex justify-end mb-1">
        <button
          onClick={toggleExpanded}
          className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
          aria-label="Collapse timer"
        >
          <Minimize className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col items-center">
        <div className={`text-gray-600 text-center ${variant === 'sidebar' ? 'text-xs' : 'text-sm'} mb-2`}>
          <div>Pomodoro Timer</div>
          <div className="text-xs mt-0.5">
            {completedToday} {completedToday === 1 ? 'session' : 'sessions'} completed in the last 24h
          </div>
        </div>
        <div className="flex items-center justify-center w-full space-x-2">
          <div className={`font-semibold ${variant === 'sidebar' ? 'text-lg' : 'text-2xl'} ${gradientTextClass}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={toggleTimer}
              className={`p-1.5 rounded-full ${
                isRunning 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
              }`}
              aria-label={isRunning ? 'Pause timer' : 'Start timer'}
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button 
              onClick={resetTimer}
              className="p-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              aria-label="Reset timer"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button 
              onClick={toggleNotifications}
              className={`p-1.5 rounded-full ${
                notificationsEnabled 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
            >
              <BellRing className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroWidget; 
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw, X, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type SessionType = 'focus' | 'shortBreak' | 'longBreak';

interface PomodoroFloatingWidgetProps {
  onClose: () => void;
}

export default function PomodoroFloatingWidget({ onClose }: PomodoroFloatingWidgetProps) {
  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<SessionType>('focus');
  const [isMinimized, setIsMinimized] = useState(false);
  
  const router = useRouter();
  
  // Audio reference
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Handle session completion
      handleSessionComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle session completion
  const handleSessionComplete = () => {
    setIsActive(false);
    
    if (currentSession === 'focus') {
      setCurrentSession('shortBreak');
      setTimeLeft(5 * 60); // 5 minutes
    } else {
      setCurrentSession('focus');
      setTimeLeft(25 * 60); // 25 minutes
    }
    
    // Play notification sound
    if (alarmSoundRef.current) {
      alarmSoundRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
    
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        currentSession === 'focus' 
          ? 'Break Time!' 
          : 'Focus Time!', 
        { 
          body: currentSession === 'focus' 
            ? 'Good job! Take a break.' 
            : 'Break is over. Time to focus!',
          icon: '/favicon.ico'
        }
      );
    }
  };
  
  // Timer controls
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    
    if (currentSession === 'focus') {
      setTimeLeft(25 * 60); // 25 minutes
    } else {
      setTimeLeft(5 * 60); // 5 minutes
    }
  };
  
  // Get background color based on session type
  const getBackgroundColor = () => {
    return currentSession === 'focus'
      ? 'from-blue-500 to-purple-600'
      : 'from-green-400 to-teal-500';
  };

  const goToFullTimer = () => {
    router.push('/dashboard/timer');
  };
  
  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg p-2 cursor-pointer z-50"
        onClick={() => setIsMinimized(false)}
      >
        <div className={`bg-gradient-to-br ${getBackgroundColor()} text-white rounded-full w-12 h-12 flex items-center justify-center`}>
          <span className="text-xs font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg overflow-hidden z-50" style={{ width: '280px' }}>
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Pomodoro Timer
        </h3>
        <div className="flex space-x-1">
          <button 
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button 
            onClick={goToFullTimer}
            className="text-gray-400 hover:text-gray-600"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col items-center">
        <div className={`bg-gradient-to-br ${getBackgroundColor()} text-white rounded-full w-20 h-20 flex items-center justify-center mb-3`}>
          <span className="text-lg font-bold">{formatTime(timeLeft)}</span>
        </div>
        
        <p className="text-xs text-gray-600 mb-3 text-center">
          {currentSession === 'focus' 
            ? 'Focus Session' 
            : 'Break Time'}
        </p>
        
        <div className="flex justify-center space-x-2">
          <button 
            onClick={toggleTimer}
            className={`p-2 rounded-full ${
              isActive 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button 
            onClick={resetTimer}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 
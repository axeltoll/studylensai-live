'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw, Settings, Coffee, CheckCircle2, Plus, Minus, X } from 'lucide-react';
import withAuth from '@/app/components/auth/withAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

// Define Pomodoro session types
type SessionType = 'focus' | 'shortBreak' | 'longBreak';

const DEFAULT_TIMES = {
  focus: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

function PomodoroTimer() {
  // Timer state
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES.focus);
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<SessionType>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings state
  const [focusTime, setFocusTime] = useState(DEFAULT_TIMES.focus / 60);
  const [shortBreakTime, setShortBreakTime] = useState(DEFAULT_TIMES.shortBreak / 60);
  const [longBreakTime, setLongBreakTime] = useState(DEFAULT_TIMES.longBreak / 60);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  
  // Session history
  const [sessionHistory, setSessionHistory] = useState<Array<{
    type: SessionType;
    duration: number;
    completed: boolean;
    timestamp: Date;
  }>>([]);

  // Audio references
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio on component mount
  useEffect(() => {
    // Use browser beep sound instead of an audio file for now
    alarmSoundRef.current = new Audio('/sounds/bell.mp3');
    
    return () => {
      if (alarmSoundRef.current) {
        alarmSoundRef.current = null;
      }
    };
  }, []);
  
  // Load saved settings and history from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setFocusTime(settings.focusTime || DEFAULT_TIMES.focus / 60);
      setShortBreakTime(settings.shortBreakTime || DEFAULT_TIMES.shortBreak / 60);
      setLongBreakTime(settings.longBreakTime || DEFAULT_TIMES.longBreak / 60);
      setLongBreakInterval(settings.longBreakInterval || 4);
    }
    
    const savedHistory = localStorage.getItem('pomodoroHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      // Convert string timestamps back to Date objects
      history.forEach((item: any) => item.timestamp = new Date(item.timestamp));
      setSessionHistory(history);
      
      // Count completed focus sessions
      const completedSessions = history.filter((item: any) => 
        item.type === 'focus' && item.completed
      ).length;
      setSessionsCompleted(completedSessions);
    }
  }, []);
  
  // Save settings when changed
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify({
      focusTime,
      shortBreakTime,
      longBreakTime,
      longBreakInterval
    }));
  }, [focusTime, shortBreakTime, longBreakTime, longBreakInterval]);
  
  // Save history when changed
  useEffect(() => {
    localStorage.setItem('pomodoroHistory', JSON.stringify(sessionHistory));
  }, [sessionHistory]);

  // Handle session completion
  const handleSessionComplete = () => {
    setIsActive(false);
    
    // Record completed session
    setSessionHistory(prev => [
      {
        type: currentSession,
        duration: currentSession === 'focus' 
          ? focusTime * 60 
          : currentSession === 'shortBreak' 
            ? shortBreakTime * 60 
            : longBreakTime * 60,
        completed: true,
        timestamp: new Date()
      },
      ...prev
    ]);
    
    if (currentSession === 'focus') {
      // Increment completed sessions counter
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      // Determine if we should take a long break
      if (newSessionsCompleted % longBreakInterval === 0) {
        setCurrentSession('longBreak');
        setTimeLeft(longBreakTime * 60);
      } else {
        setCurrentSession('shortBreak');
        setTimeLeft(shortBreakTime * 60);
      }
    } else {
      // After any break, go back to focus session
      setCurrentSession('focus');
      setTimeLeft(focusTime * 60);
    }
    
    // Play notification sound
    if (alarmSoundRef.current) {
      alarmSoundRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
    
    // Notify user
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
  
  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Play sound when timer ends
      if (alarmSoundRef.current) {
        alarmSoundRef.current.play().catch(e => console.error("Error playing sound:", e));
      }
      
      // Handle session completion
      handleSessionComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);
  
  // Timer controls
  const toggleTimer = () => {
    if (!isActive && timeLeft === 0) {
      // Timer is finished, reset it based on current session
      if (currentSession === 'focus') {
        setTimeLeft(focusTime * 60);
      } else if (currentSession === 'shortBreak') {
        setTimeLeft(shortBreakTime * 60);
      } else {
        setTimeLeft(longBreakTime * 60);
      }
    }
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    
    // Reset time based on current session type
    if (currentSession === 'focus') {
      setTimeLeft(focusTime * 60);
    } else if (currentSession === 'shortBreak') {
      setTimeLeft(shortBreakTime * 60);
    } else {
      setTimeLeft(longBreakTime * 60);
    }
  };
  
  const changeSession = (sessionType: SessionType) => {
    setIsActive(false);
    setCurrentSession(sessionType);
    
    // Set time based on session type
    if (sessionType === 'focus') {
      setTimeLeft(focusTime * 60);
    } else if (sessionType === 'shortBreak') {
      setTimeLeft(shortBreakTime * 60);
    } else {
      setTimeLeft(longBreakTime * 60);
    }
  };
  
  // Settings handlers
  const handleSaveSettings = () => {
    // Reset timer with new values
    if (currentSession === 'focus') {
      setTimeLeft(focusTime * 60);
    } else if (currentSession === 'shortBreak') {
      setTimeLeft(shortBreakTime * 60);
    } else {
      setTimeLeft(longBreakTime * 60);
    }
    
    setShowSettings(false);
  };
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    let totalTime;
    if (currentSession === 'focus') {
      totalTime = focusTime * 60;
    } else if (currentSession === 'shortBreak') {
      totalTime = shortBreakTime * 60;
    } else {
      totalTime = longBreakTime * 60;
    }
    
    return ((totalTime - timeLeft) / totalTime) * 100;
  };
  
  // Get session color class
  const getSessionColorClass = () => {
    if (currentSession === 'focus') {
      return 'from-blue-500 to-purple-600';
    } else if (currentSession === 'shortBreak') {
      return 'from-green-400 to-teal-500';
    } else {
      return 'from-amber-400 to-orange-500';
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="max-w-5xl mx-auto pt-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Pomodoro Productivity Timer
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Timer */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Focus Timer</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Session Tabs */}
              <TabsList className="bg-gray-100 dark:bg-gray-800 mt-2">
                <TabsTrigger 
                  value="focus"
                  className={currentSession === 'focus' ? 'bg-blue-100 text-blue-700' : ''}
                  onClick={() => changeSession('focus')}
                >
                  Focus
                </TabsTrigger>
                <TabsTrigger 
                  value="shortBreak"
                  className={currentSession === 'shortBreak' ? 'bg-green-100 text-green-700' : ''}
                  onClick={() => changeSession('shortBreak')}
                >
                  Short Break
                </TabsTrigger>
                <TabsTrigger 
                  value="longBreak"
                  className={currentSession === 'longBreak' ? 'bg-orange-100 text-orange-700' : ''}
                  onClick={() => changeSession('longBreak')}
                >
                  Long Break
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="pt-4">
              {/* Settings Panel */}
              {showSettings ? (
                <div className="p-4 bg-gray-50 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Timer Settings</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowSettings(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Focus Time (minutes)</label>
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setFocusTime(Math.max(1, focusTime - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 min-w-[30px] text-center">{focusTime}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setFocusTime(focusTime + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Short Break (minutes)</label>
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShortBreakTime(Math.max(1, shortBreakTime - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 min-w-[30px] text-center">{shortBreakTime}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShortBreakTime(shortBreakTime + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Long Break (minutes)</label>
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLongBreakTime(Math.max(1, longBreakTime - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 min-w-[30px] text-center">{longBreakTime}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLongBreakTime(longBreakTime + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Long Break After (sessions)</label>
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLongBreakInterval(Math.max(1, longBreakInterval - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 min-w-[30px] text-center">{longBreakInterval}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLongBreakInterval(longBreakInterval + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button onClick={handleSaveSettings}>Save Settings</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6">
                  {/* Progress Circle */}
                  <div className="relative mb-6">
                    <div className="w-48 h-48 rounded-full flex items-center justify-center bg-gray-100">
                      <div 
                        className={`w-44 h-44 rounded-full bg-gradient-to-br ${getSessionColorClass()} flex items-center justify-center`}
                        style={{
                          backgroundImage: `conic-gradient(${
                            currentSession === 'focus' 
                              ? '#6366f1' 
                              : currentSession === 'shortBreak' 
                                ? '#10b981' 
                                : '#f97316'
                          } ${calculateProgress()}%, #e5e7eb ${calculateProgress()}% 100%)`
                        }}
                      >
                        <div className="w-40 h-40 rounded-full bg-white flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold mb-1">{formatTime(timeLeft)}</span>
                          <span className="text-sm text-gray-500 capitalize">{currentSession.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex space-x-4">
                    <Button
                      className={`rounded-full p-3 ${
                        isActive 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      onClick={toggleTimer}
                    >
                      {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full p-3"
                      onClick={resetTimer}
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Session Counter */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      {sessionsCompleted} focus {sessionsCompleted === 1 ? 'session' : 'sessions'} completed today
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Long break after {longBreakInterval - (sessionsCompleted % longBreakInterval)} more {(longBreakInterval - (sessionsCompleted % longBreakInterval)) === 1 ? 'session' : 'sessions'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Session History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session History</CardTitle>
            </CardHeader>
            <CardContent>
              {sessionHistory.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {sessionHistory.slice(0, 10).map((session, index) => (
                    <div key={index} className="flex items-center p-2 rounded-lg bg-gray-50">
                      {session.type === 'focus' ? (
                        <Clock className="h-4 w-4 text-blue-500 mr-3" />
                      ) : session.type === 'shortBreak' ? (
                        <Coffee className="h-4 w-4 text-green-500 mr-3" />
                      ) : (
                        <Coffee className="h-4 w-4 text-orange-500 mr-3" />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">
                            {session.type.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(session.timestamp)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-600">
                            {Math.floor(session.duration / 60)} minutes
                          </span>
                          {session.completed && (
                            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p>No sessions recorded yet</p>
                  <p className="text-sm mt-1">Complete a timer to see history</p>
                </div>
              )}
              
              {sessionHistory.length > 10 && (
                <Button variant="link" className="mt-2 w-full text-sm">
                  View all ({sessionHistory.length}) sessions
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Pomodoro Technique Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>The Pomodoro Technique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">What is it?</h3>
              <p className="text-sm text-blue-700">
                The Pomodoro Technique is a time management method developed by Francesco Cirillo. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">How to use it</h3>
              <ol className="text-sm text-green-700 space-y-1 list-decimal pl-4">
                <li>Set the timer (25 min default)</li>
                <li>Work until the timer rings</li>
                <li>Take a short break (5 min)</li>
                <li>After 4 sessions, take a longer break (15-30 min)</li>
              </ol>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">Benefits</h3>
              <ul className="text-sm text-purple-700 space-y-1 list-disc pl-4">
                <li>Improves focus and concentration</li>
                <li>Reduces mental fatigue</li>
                <li>Increases accountability</li>
                <li>Creates a sense of accomplishment</li>
                <li>Helps manage distractions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(PomodoroTimer); 

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, Timer, Coffee, Trophy, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StudySession {
  id: string;
  duration: number;
  type: "work" | "break";
  completedAt: string;
}

const StudyTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem("studyplanner-sessions");
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }

    const savedSettings = localStorage.getItem("studyplanner-timer-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Initialize audio for notifications
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmASBkOZ2+/HdSAHL4nS8dmKOwoUY7bt5Z5NEA1Mp+LwuGURAiiH0O3QfDEGA0iZ4OjEaj4ECdOkdDMS");
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem("studyplanner-sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("studyplanner-timer-settings", JSON.stringify(settings));
  }, [settings]);

  // Timer countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Fallback if audio fails
        console.log("Audio notification failed");
      });
    }

    // Record session
    const newSession: StudySession = {
      id: Date.now().toString(),
      duration: isBreak ? settings.shortBreak : settings.workDuration,
      type: isBreak ? "break" : "work",
      completedAt: new Date().toISOString()
    };

    setSessions(prev => [newSession, ...prev.slice(0, 49)]); // Keep last 50 sessions

    // Show notification
    if (isBreak) {
      toast({
        title: "Break Complete! ⏰",
        description: "Time to get back to work!"
      });
      setIsBreak(false);
      setTimeLeft(settings.workDuration * 60);
    } else {
      const workSessions = sessions.filter(s => s.type === "work").length + 1;
      const isLongBreak = workSessions % settings.sessionsUntilLongBreak === 0;
      
      toast({
        title: "Work Session Complete! 🎉",
        description: isLongBreak ? "Time for a long break!" : "Time for a short break!"
      });
      
      setIsBreak(true);
      setTimeLeft((isLongBreak ? settings.longBreak : settings.shortBreak) * 60);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(settings.workDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentDuration = () => {
    return isBreak ? 
      (sessions.filter(s => s.type === "work").length % settings.sessionsUntilLongBreak === 0 ? 
        settings.longBreak : settings.shortBreak) : settings.workDuration;
  };

  const progress = ((getCurrentDuration() * 60 - timeLeft) / (getCurrentDuration() * 60)) * 100;

  const todaySessions = sessions.filter(session => {
    const today = new Date().toDateString();
    return new Date(session.completedAt).toDateString() === today;
  });

  const todayWorkTime = todaySessions
    .filter(s => s.type === "work")
    .reduce((total, session) => total + session.duration, 0);

  const completedPomodoros = todaySessions.filter(s => s.type === "work").length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-indigo-900">Study Timer</h1>
        <p className="text-gray-600">Focus with the Pomodoro Technique</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timer */}
        <div className="lg:col-span-2">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                {isBreak ? <Coffee className="h-6 w-6" /> : <Timer className="h-6 w-6" />}
                {isBreak ? "Break Time" : "Focus Time"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Timer Display */}
              <div className="space-y-4">
                <div className={`text-6xl sm:text-8xl font-mono font-bold ${isBreak ? "text-green-600" : "text-indigo-600"}`}>
                  {formatTime(timeLeft)}
                </div>
                <Progress value={progress} className="h-3" />
                <Badge variant={isBreak ? "secondary" : "default"} className="text-lg px-4 py-2">
                  {isBreak ? "Break" : "Focus"} Session
                </Badge>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className={`px-8 ${isBreak ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                  {isActive ? "Pause" : "Start"}
                </Button>
                <Button onClick={resetTimer} variant="outline" size="lg">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Today's Progress */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{completedPomodoros}</div>
                  <div className="text-sm text-gray-600">Pomodoros Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.floor(todayWorkTime / 60)}h {todayWorkTime % 60}m</div>
                  <div className="text-sm text-gray-600">Study Time Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings & Stats */}
        <div className="space-y-6">
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Work Duration (minutes)</label>
                <Select 
                  value={settings.workDuration.toString()} 
                  onValueChange={(value) => setSettings({...settings, workDuration: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="25">25 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Short Break (minutes)</label>
                <Select 
                  value={settings.shortBreak.toString()} 
                  onValueChange={(value) => setSettings({...settings, shortBreak: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Long Break (minutes)</label>
                <Select 
                  value={settings.longBreak.toString()} 
                  onValueChange={(value) => setSettings({...settings, longBreak: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {sessions.slice(0, 10).map((session) => (
                  <div key={session.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {session.type === "work" ? (
                        <Timer className="h-3 w-3 text-indigo-500" />
                      ) : (
                        <Coffee className="h-3 w-3 text-green-500" />
                      )}
                      <span className="capitalize">{session.type}</span>
                    </div>
                    <div className="text-gray-500">
                      {session.duration}m
                    </div>
                  </div>
                ))}
                
                {sessions.length === 0 && (
                  <div className="text-center py-4">
                    <Timer className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No sessions yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;

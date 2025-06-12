
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, BookOpen, ListTodo, Calendar, Timer } from "lucide-react";
import { Link } from "react-router-dom";

const motivationalQuotes = [
  "The expert in anything was once a beginner. - Helen Hayes",
  "Success is the sum of small efforts repeated day in and day out. - Robert Collier",
  "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
  "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
  "Study hard, for the well is deep, and our brains are shallow. - Richard Baxter",
  "Learning never exhausts the mind. - Leonardo da Vinci",
  "The roots of education are bitter, but the fruit is sweet. - Aristotle",
  "An investment in knowledge pays the best interest. - Benjamin Franklin"
];

const Index = () => {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  const changeQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  };

  useEffect(() => {
    changeQuote();
  }, []);

  const quickActions = [
    { 
      title: "Subjects", 
      description: "View and manage your subjects and grades", 
      icon: BookOpen, 
      path: "/subjects",
      color: "from-blue-500 to-blue-600"
    },
    { 
      title: "To-Do List", 
      description: "Add and track your academic tasks", 
      icon: ListTodo, 
      path: "/todo",
      color: "from-green-500 to-green-600"
    },
    { 
      title: "Calendar", 
      description: "See your deadlines and events", 
      icon: Calendar, 
      path: "/calendar",
      color: "from-purple-500 to-purple-600"
    },
    { 
      title: "Study Timer", 
      description: "Focus with the Pomodoro technique", 
      icon: Timer, 
      path: "/timer",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-900 leading-tight">
          Welcome to Your
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Academic Journey
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Stay organized, focused, and motivated with your personal study companion
        </p>
      </div>

      {/* Motivational Quote Card */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
        <CardContent className="p-8 text-center">
          <blockquote className="text-lg sm:text-xl italic font-medium mb-4">
            "{currentQuote}"
          </blockquote>
          <Button 
            onClick={changeQuote}
            variant="secondary"
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            New Quote
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Link key={action.path} to={action.path}>
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
              <CardContent className="p-6 text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-indigo-600">4</div>
            <div className="text-sm text-gray-600">Active Subjects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">Tasks Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">85%</div>
            <div className="text-sm text-gray-600">Average Grade</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

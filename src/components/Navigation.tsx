
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, ListTodo, Calendar, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/subjects", label: "Subjects", icon: BookOpen },
    { path: "/todo", label: "To-Do", icon: ListTodo },
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/timer", label: "Timer", icon: Timer },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-indigo-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-indigo-900">StudyPlanner</span>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === path
                    ? "bg-indigo-100 text-indigo-700 shadow-sm"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

import { LogOut, Home, User, BookOpen } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // TODO: Clear auth status
    navigate("/login");
  };

  const navItems = [
    { label: "Home", icon: <Home className="w-5 h-5 mr-3" />, path: "/home" },
    { label: "Courses", icon: <BookOpen className="w-5 h-5 mr-3" />, path: "/courses" },
    { label: "Profile", icon: <User className="w-5 h-5 mr-3" />, path: "/profile" },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-800 tracking-tight">UniDay</h2>
        <p className="text-sm text-slate-500 mt-1">Management Portal</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start text-slate-600 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
import { LogOut, Home, User, BookOpen } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col h-full bg-[#0373fc] text-white border-r border-blue-600">
      <div className="p-6 pb-2">
        <div className="bg-white/10 rounded-md p-4 mb-4 border border-white/20">
          <h3 className="font-semibold text-lg text-white">Student</h3>
          <p className="text-white/80 text-sm">Undergraduate</p>
          <p className="text-white/80 text-xs mt-1">BINUS University</p>
          <div className="mt-3">
             <Badge className="bg-[#f17105] hover:bg-[#d66405] text-white text-xs border-0">CHANGE</Badge>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/10 text-white border-l-4 border-white"
                  : "text-white/80 border-l-4 border-transparent hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/20">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start text-white hover:text-white hover:bg-white/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
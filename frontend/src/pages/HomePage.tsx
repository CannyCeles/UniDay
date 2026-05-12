import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const fullName = user?.name || "User";
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [classSessions, setClassSessions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Fetch class sessions
    const fetchClassSessions = async () => {
      try {
        const response = await fetch("http://localhost:3000/class-session", {
          headers: {
            Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setClassSessions(data);
        }
      } catch (error) {
        console.error("Error fetching class sessions:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3000/course", {
          headers: {
            Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchClassSessions();
    fetchCourses();

    return () => clearInterval(timer);
  }, [user?.token]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.theme = 'dark';
    } else {
      root.classList.remove("dark");
      localStorage.theme = 'light';
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const formattedTime = currentTime.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex flex-col w-full gap-6">
      <header className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-3xl items-center font-normal text-slate-700 dark:text-slate-100 tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
            <Clock className="w-4 h-4 text-[#009FE3]" />
            <span className="text-sm font-medium">{formattedTime}</span>
          </div>
          <Link to="/profile">
            <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700 cursor-pointer hover:ring-2 hover:ring-[#009FE3] transition-all">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#009FE3] text-white text-xs">
                {fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <span className="text-slate-600 dark:text-slate-300 text-sm hidden sm:block">Welcome, {fullName}</span>
          <div className="flex items-center ml-4">
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:ring-offset-2 ${
                isDarkMode ? 'bg-[#009FE3]' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            {isDarkMode ? <Moon className="w-4 h-4 ml-2 text-slate-500 dark:text-slate-400" /> : <Sun className="w-4 h-4 ml-2 text-slate-500 dark:text-slate-400" />}
          </div>
        </div>
      </header>
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="md:col-span-2">
          <Card className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[500px] text-slate-800 dark:text-slate-100 rounded-md">
            <Tabs defaultValue="classes" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-t-md rounded-b-none bg-slate-50 dark:bg-slate-800 p-0 h-auto border-b border-slate-200 dark:border-slate-700">
                <TabsTrigger 
                  value="classes"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-[#009FE3] data-[state=active]:border-b-2 data-[state=active]:border-[#009FE3] py-4 rounded-none transition-all text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {user?.role === 'lecturer' ? "My Upcoming Classes" : "View Upcoming Classes"}
                </TabsTrigger>
                <TabsTrigger 
                  value="enrollment"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-[#009FE3] data-[state=active]:border-b-2 data-[state=active]:border-[#009FE3] py-4 rounded-none transition-all text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {user?.role === 'lecturer' ? "Teaching Schedule" : "Course Enrollment"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="classes" className="p-6 mt-0">
                <div className="flex flex-col gap-4">
                  {classSessions.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-4">No upcoming classes found.</p>
                  ) : (
                    classSessions.map((session) => {
                      const startDate = new Date(session.startTime);
                      const endDate = new Date(session.endTime);
                      
                      const today = new Date();
                      const tomorrow = new Date(today);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      let dayLabel = startDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                      if (startDate.toDateString() === today.toDateString()) dayLabel = "Today";
                      else if (startDate.toDateString() === tomorrow.toDateString()) dayLabel = "Tomorrow";

                      const timeStr = `${startDate.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}`;
                      
                      return (
                        <div key={session.id} className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{session.course?.courseName || "Unknown Course"}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{session.course?.courseCode} • {session.isOnline ? "Online" : session.classroom}</p>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <span className="bg-[#e0f4fc] dark:bg-[#009FE3]/20 text-[#009FE3] dark:text-[#009FE3] px-3 py-1 rounded-full text-sm font-medium mb-1">{dayLabel}</span>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{timeStr}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              <TabsContent value="enrollment" className="p-6 mt-0">
                <div className="flex flex-col gap-4 text-center py-4">
                  {user?.role === 'lecturer' ? (
                    <div className="text-left w-full h-full pb-4">
                      <h2 className="text-xl pl-2 mb-4 font-semibold text-slate-800 dark:text-slate-100 text-left">Your Teaching Schedule</h2>
                      {courses.length === 0 ? (
                        <p className="text-center text-slate-500 py-4">No courses assigned to you.</p>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {courses.map(course => (
                            <Card key={course.id} className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-md p-4 flex flex-col">
                              <h3 className="text-lg font-semibold">{course.courseName}</h3>
                              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{course.courseCode} • {course.credits} Credits</p>
                              <div className="mt-4 flex flex-col gap-2">
                                {(course.classSessions && course.classSessions.length > 0) ? (
                                  course.classSessions.map((session: any) => (
                                    <div key={session.id} className="text-sm bg-slate-50 dark:bg-slate-800 p-2 rounded-md flex justify-between border border-slate-100 dark:border-slate-700">
                                      <span>{new Date(session.startTime).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                                      <span className="font-medium">{new Date(session.startTime).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-slate-500">No sessions scheduled.</p>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-500 dark:text-slate-400 py-12">Registration opens next week.</p>
                      <Button variant="outline" className="mx-auto bg-[#009FE3] text-white border-transparent hover:bg-[#008bc6] hover:text-white mt-4 w-fit">
                        View Course Catalog
                      </Button>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[500px] text-slate-800 dark:text-slate-100 rounded-md">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-xl font-normal text-slate-700 dark:text-slate-100 flex justify-between items-center">
                To-Do
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-5">
                <li>
                  <Link to="/profile" className="flex items-center gap-3 group">
                    <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-[#009FE3] transition-colors"></div>
                    <span className="text-slate-600 dark:text-slate-300 font-medium group-hover:text-[#009FE3] transition-colors">Upload profile photo</span>
                  </Link>
                </li>
                {user?.role === 'lecturer' ? (
                  <li>
                    <Link to="/courses" className="flex items-center gap-3 group">
                      <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-[#009FE3] transition-colors"></div>
                      <span className="text-slate-600 dark:text-slate-300 font-medium group-hover:text-[#009FE3] transition-colors">Create class sessions</span>
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/courses" className="flex items-center gap-3 group">
                      <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-[#009FE3] transition-colors"></div>
                      <span className="text-slate-600 dark:text-slate-300 font-medium group-hover:text-[#009FE3] transition-colors">Enroll in new course</span>
                    </Link>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
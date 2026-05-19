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
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);
  const [selectedSessionForModal, setSelectedSessionForModal] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const fetchClassSessions = async () => {
      console.log("fetchClassSessions -> Fetching sessions");
      try {
        const response = await fetch("http://localhost:3000/class-session", {
          headers: {
            Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`
          }
        });
        console.log("fetchClassSessions -> Response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("fetchClassSessions -> Class sessions fetched:", data);
          setClassSessions(data);
        } else {
          console.error("fetchClassSessions -> Server error status:", response.status);
        }
      } catch (error) {
        console.error("fetchClassSessions -> Network error:", error);
      }
    };

    const fetchCourses = async () => {
      console.log("fetchCourses -> Fetching all courses");
      try {
        const response = await fetch("http://localhost:3000/course", {
          headers: {
            Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`
          }
        });
        console.log("fetchCourses -> Response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("fetchCourses -> Courses fetched:", data);
          setCourses(data);
        } else {
          console.error("fetchCourses -> Server error status:", response.status);
        }
      } catch (error) {
        console.error("fetchCourses -> Network error:", error);
      }
    };

    const fetchEnrolledCourses = async () => {
      if (user?.role === 'student') {
        console.log("fetchEnrolledCourses -> user.id:", user?.id);
        try {
          const response = await fetch(`http://localhost:3000/enrollment/student/${user?.id}`, {
            headers: {
              Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`
            }
          });
          console.log("fetchEnrolledCourses -> Response status:", response.status);
          if (response.ok) {
            const data = await response.json();
            console.log("fetchEnrolledCourses -> Enrolled courses fetched:", data);
            setEnrolledCourseIds(data.map((course: any) => course.id));
          } else {
            console.error("fetchEnrolledCourses -> Server error status:", response.status);
          }
        } catch (error) {
          console.error("fetchEnrolledCourses -> Network error:", error);
        }
      }
    };

    fetchClassSessions();
    fetchCourses();
    fetchEnrolledCourses();

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
              <AvatarImage src={user?.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:3000${user.avatarUrl}`) : ""} className="object-cover" />
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
                      const isOngoing = currentTime >= startDate && currentTime <= endDate;
                      
                      return (
                        <div 
                          key={session.id} 
                          onClick={() => {
                            if (user?.role === 'lecturer') {
                              console.log("Upcoming Class Card clicked -> showing roster modal for session:", session.id);
                              setSelectedSessionForModal(session);
                            }
                          }}
                          className={`p-4 bg-white dark:bg-slate-900 rounded-lg border shadow-sm flex items-center justify-between transition-all duration-300 ${
                            isOngoing 
                              ? "border-red-500 dark:border-red-500 ring-2 ring-red-500/20 shadow-md animate-pulse" 
                              : "border-slate-200 dark:border-slate-800"
                          } ${
                            user?.role === 'lecturer' 
                              ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-[#009FE3]" 
                              : ""
                          }`}
                        >
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{session.course?.name || "Unknown Course"}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{session.course?.courseCode} • {session.isOnline ? "Online" : session.classroom}</p>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            {isOngoing ? (
                              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-1 tracking-wider uppercase">ONGOING</span>
                            ) : (
                              <span className="bg-[#e0f4fc] dark:bg-[#009FE3]/20 text-[#009FE3] dark:text-[#009FE3] px-3 py-1 rounded-full text-sm font-medium mb-1">{dayLabel}</span>
                            )}
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
                            <Card key={course.id} className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-md p-4 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#009FE3]">
                              <h3 className="text-lg font-semibold">{course.name}</h3>
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
                    <div className="text-left w-full h-full pb-4">
                      <h2 className="text-xl pl-2 mb-4 font-semibold text-slate-800 dark:text-slate-100 text-left">Available Courses</h2>
                      {courses.length === 0 ? (
                        <p className="text-center text-slate-500 py-4">No courses available.</p>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {courses.map(course => (
                            <Card key={course.id} className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-md p-4 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#009FE3]">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold">{course.name}</h3>
                                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{course.courseCode} • {course.credits || 3} Credits</p>
                                  <p className="text-xs text-slate-400 mt-1">Lecturer: <span className="font-medium text-slate-600 dark:text-slate-300">{course.lecturer?.name || "N/A"}</span></p>
                                </div>
                                {enrolledCourseIds.includes(course.id) ? (
                                  <Button 
                                    variant="outline" 
                                    className="bg-slate-300 text-slate-600 border-transparent cursor-default hover:bg-slate-300 hover:text-slate-600"
                                    disabled
                                  >
                                    Enrolled
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    className="bg-[#009FE3] text-white border-transparent hover:bg-[#008bc6] hover:text-white"
                                    onClick={async () => {
                                      console.log("Enrollment trigger -> course:", course.name, "courseId:", course.id, "studentId:", user?.id);
                                      try {
                                        const response = await fetch("http://localhost:3000/enrollment", {
                                          method: "POST",
                                          headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`
                                          },
                                          body: JSON.stringify({
                                            studentId: Number(user?.id),
                                            courseId: Number(course.id)
                                          })
                                        });
                                        console.log("Enrollment trigger -> Response status:", response.status);
                                        if (response.ok) {
                                          console.log(`Enrollment trigger -> Success: Enrolled in ${course.name}`);
                                          setEnrolledCourseIds([...enrolledCourseIds, course.id]);
                                        } else {
                                          const errText = await response.text();
                                          console.error("Enrollment trigger -> Server error:", errText);
                                        }
                                      } catch (e) {
                                        console.error("Enrollment trigger -> Network error:", e);
                                      }
                                    }}
                                  >
                                    Enroll
                                  </Button>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
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
                    <div className={`h-4 w-4 rounded-full border-2 transition-colors flex items-center justify-center ${user?.avatarUrl ? 'bg-[#009FE3] border-[#009FE3]' : 'border-slate-300 dark:border-slate-600 group-hover:border-[#009FE3]'}`}>
                      {user?.avatarUrl && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={`font-medium transition-colors ${user?.avatarUrl ? 'text-[#009FE3] line-through' : 'text-slate-600 dark:text-slate-300 group-hover:text-[#009FE3]'}`}>Upload profile photo</span>
                  </Link>
                </li>
                {user?.role === 'lecturer' ? (
                  <li>
                    <Link to="/courses" className="flex items-center gap-3 group">
                      <div className={`h-4 w-4 rounded-full border-2 transition-colors flex items-center justify-center ${courses.length > 0 ? 'bg-[#009FE3] border-[#009FE3]' : 'border-slate-300 dark:border-slate-600 group-hover:border-[#009FE3]'}`}>
                        {courses.length > 0 && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`font-medium transition-colors ${courses.length > 0 ? 'text-[#009FE3] line-through' : 'text-slate-600 dark:text-slate-300 group-hover:text-[#009FE3]'}`}>Create class sessions</span>
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/courses" className="flex items-center gap-3 group">
                      <div className={`h-4 w-4 rounded-full border-2 transition-colors flex items-center justify-center ${enrolledCourseIds.length > 0 ? 'bg-[#009FE3] border-[#009FE3]' : 'border-slate-300 dark:border-slate-600 group-hover:border-[#009FE3]'}`}>
                        {enrolledCourseIds.length > 0 && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`font-medium transition-colors ${enrolledCourseIds.length > 0 ? 'text-[#009FE3] line-through' : 'text-slate-600 dark:text-slate-300 group-hover:text-[#009FE3]'}`}>Enroll in new course</span>
                    </Link>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {selectedSessionForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold tracking-tight">{selectedSessionForModal.course?.name}</h2>
                <p className="text-sm font-mono text-[#009FE3] dark:text-[#33bbf2] mt-1">{selectedSessionForModal.course?.courseCode}</p>
              </div>
              <button 
                onClick={() => setSelectedSessionForModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
              >
                <span className="text-xl font-semibold">&times;</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Enrolled Students ({selectedSessionForModal.course?.enrollments?.length || 0})</h3>
              
              {!selectedSessionForModal.course?.enrollments || selectedSessionForModal.course.enrollments.length === 0 ? (
                <p className="text-slate-400 text-center py-6 text-sm">No students currently enrolled.</p>
              ) : (
                <div className="space-y-3">
                  {selectedSessionForModal.course.enrollments.map((enrollment: any) => {
                    const student = enrollment.student;
                    if (!student) return null;
                    return (
                      <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                          <AvatarImage src={student.avatarUrl ? (student.avatarUrl.startsWith('http') ? student.avatarUrl : `http://localhost:3000${student.avatarUrl}`) : ""} className="object-cover" />
                          <AvatarFallback className="bg-[#009FE3] text-white text-sm font-semibold">
                            {student.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{student.name}</p>
                          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{student.studentId}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button 
                onClick={() => setSelectedSessionForModal(null)}
                className="bg-[#009FE3] hover:bg-[#008bc6] text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
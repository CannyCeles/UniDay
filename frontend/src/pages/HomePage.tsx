import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, Moon, Sun, Camera, CheckCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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
  const [modalEnrolledStudents, setModalEnrolledStudents] = useState<any[] | null>(null);
  const [isLoadingModalStudents, setIsLoadingModalStudents] = useState(false);

  const [studentAttendances, setStudentAttendances] = useState<any[]>([]);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [editorImageSrc, setEditorImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [displayDims, setDisplayDims] = useState({ w: 256, h: 256 });
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (selectedSessionForModal && selectedSessionForModal.course) {
      console.log("Roster Modal -> Fetching enrolled students for course:", selectedSessionForModal.course.name);
      setIsLoadingModalStudents(true);
      fetch("http://localhost:3000/enrollment", {
        headers: {
          Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`
        }
      })
      .then(res => res.json())
      .then(enrollments => {
        const courseEnrollments = enrollments.filter((e: any) => e.courseId === selectedSessionForModal.course.id);
        const students = courseEnrollments.map((e: any) => e.student).filter(Boolean);
        console.log("Roster Modal -> Enrolled students successfully fetched:", students);
        setModalEnrolledStudents(students);
        setIsLoadingModalStudents(false);
      })
      .catch(err => {
        console.error("Roster Modal -> Error fetching enrolled students:", err);
        setIsLoadingModalStudents(false);
        const preLoaded = selectedSessionForModal.course.enrollments?.map((e: any) => e.student).filter(Boolean) || [];
        setModalEnrolledStudents(preLoaded);
      });
    } else {
      setModalEnrolledStudents(null);
    }
  }, [selectedSessionForModal, user?.token]);

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
    fetchStudentAttendances();

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

  const fetchStudentAttendances = async () => {
    try {
      const response = await fetch("http://localhost:3000/attendance", {
        headers: {
          Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (user?.role === 'student') {
          const myRecords = data.filter((r: any) => r.studentId === Number(user?.id));
          setStudentAttendances(myRecords);
        } else {
          setStudentAttendances(data);
        }
      }
    } catch (error) {
      console.error("fetchStudentAttendances -> Error:", error);
    }
  };

  const startWebcam = async () => {
    setIsWebcamOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 400 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("startWebcam -> Camera error:", err);
      alert("Could not access camera. Please check permissions.");
      setIsWebcamOpen(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsWebcamOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 400;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setEditorImageSrc(dataUrl);
        setZoom(1);
        setPosition({ x: 0, y: 0 });

        const img = new Image();
        img.onload = () => {
          const aspect = img.width / img.height;
          let w = 256;
          let h = 256;
          if (aspect > 1) {
            w = 256 * aspect;
          } else {
             h = 256 / aspect;
          }
          setDisplayDims({ w, h });
        };
        img.src = dataUrl;
      }
      stopWebcam();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleCropAndVerifyAttendance = async () => {
    if (!editorImageSrc || !selectedSessionForModal) return;
    setIsUploading(true);

    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const factor = 400 / 256;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 400, 400);
        ctx.save();
        ctx.translate(200, 200);
        ctx.scale(zoom, zoom);
        ctx.translate((position.x * factor) / zoom, (position.y * factor) / zoom);
        ctx.drawImage(
          img,
          (-displayDims.w * factor) / 2,
          (-displayDims.h * factor) / 2,
          displayDims.w * factor,
          displayDims.h * factor
        );
        ctx.restore();

        canvas.toBlob(async (blob) => {
          if (!blob) {
            setIsUploading(false);
            return;
          }

          const file = new File([blob], "verify.png", { type: "image/png" });
          const formData = new FormData();
          formData.append("file", file);

          try {
            const response = await fetch("http://localhost:3000/biometric/verify-face", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`,
              },
              body: formData,
            });

            const data = await response.json();

            if (data.match) {
              const confidencePercentage = Math.round((1 - data.distance) * 100);
              const attResponse = await fetch("http://localhost:3000/attendance", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  sessionId: Number(selectedSessionForModal.id),
                  studentId: Number(user?.id),
                  status: "Present",
                  matchScore: confidencePercentage
                })
              });

              if (attResponse.ok) {
                alert(`MATCH SUCCESS! Checked in successfully! Similarity: ${confidencePercentage}% Match.`);
                await fetchStudentAttendances();
                setEditorImageSrc(null);
                setSelectedSessionForModal(null);
              } else {
                alert("Face matched, but attendance recording failed. Please try again.");
              }
            } else {
              alert(`MATCH FAILED! Face did not match profile image. Similarity: ${Math.round((1 - data.distance) * 100)}% Match.`);
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("An error occurred during verification. Please try again.");
          } finally {
            setIsUploading(false);
          }
        }, "image/png");
      }
    };
    img.src = editorImageSrc;
  };

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
      <style>{`
        .trace-card {
          position: relative;
          overflow: hidden;
        }
        .trace-line-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background-color: #ef4444;
          animation: trace-bottom 4s linear infinite;
        }
        .trace-line-right {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 2px;
          background-color: #ef4444;
          animation: trace-right 4s linear infinite;
        }
        .trace-line-top {
          position: absolute;
          top: 0;
          right: 0;
          height: 2px;
          background-color: #ef4444;
          animation: trace-top 4s linear infinite;
        }
        .trace-line-left {
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          background-color: #ef4444;
          animation: trace-left 4s linear infinite;
        }
        @keyframes trace-bottom {
          0% { width: 0%; left: 0; }
          25% { width: 100%; left: 0; }
          50% { width: 0%; left: 100%; }
          100% { width: 0%; left: 100%; }
        }
        @keyframes trace-right {
          0%, 25% { height: 0%; bottom: 0; }
          50% { height: 100%; bottom: 0; }
          75% { height: 0%; bottom: 100%; }
          100% { height: 0%; bottom: 100%; }
        }
        @keyframes trace-top {
          0%, 50% { width: 0%; right: 0; }
          75% { width: 100%; right: 0; }
          100% { width: 0%; right: 100%; }
        }
        @keyframes trace-left {
          0%, 75% { height: 0%; top: 0; }
          100% { height: 100%; top: 0; }
        }
      `}</style>
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
              <TabsList className="grid w-full grid-cols-3 rounded-t-md rounded-b-none bg-slate-50 dark:bg-slate-800 p-0 h-auto border-b border-slate-200 dark:border-slate-700">
                <TabsTrigger 
                  value="classes"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-[#009FE3] data-[state=active]:border-b-2 data-[state=active]:border-[#009FE3] py-4 rounded-none transition-all text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {user?.role === 'lecturer' ? "My Upcoming Classes" : "View Upcoming Classes"}
                </TabsTrigger>
                <TabsTrigger 
                  value="past"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-[#009FE3] data-[state=active]:border-b-2 data-[state=active]:border-[#009FE3] py-4 rounded-none transition-all text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  View Past Classes
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
                  {classSessions.filter(s => new Date(s.endTime) >= currentTime).length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-4">No upcoming classes found.</p>
                  ) : (
                    classSessions
                      .filter(s => new Date(s.endTime) >= currentTime)
                      .map((session) => {
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
                      
                      const hasAttended = studentAttendances.some((r: any) => r.sessionId === session.id);
                      const traceColor = hasAttended ? "#22c55e" : "#ef4444";
                      
                      return (
                        <div 
                          key={session.id} 
                          onClick={() => {
                            if (user?.role === 'lecturer') {
                              console.log("Upcoming Class Card clicked -> showing roster modal for session:", session.id);
                              setSelectedSessionForModal(session);
                            } else if (user?.role === 'student' && isOngoing) {
                              console.log("Student clicked ongoing class card -> showing attendance modal for session:", session.id);
                              setSelectedSessionForModal(session);
                            }
                          }}
                          className={`p-4 bg-white dark:bg-slate-900 rounded-lg border shadow-sm flex items-center justify-between transition-all duration-300 relative ${
                            isOngoing 
                              ? "trace-card border-transparent dark:border-transparent shadow-md" 
                              : "border-slate-200 dark:border-slate-800"
                          } ${
                            (user?.role === 'lecturer' || (user?.role === 'student' && isOngoing))
                              ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-[#009FE3]" 
                              : ""
                          }`}
                        >
                          {isOngoing && (
                            <>
                              <span className="trace-line-bottom" style={{ backgroundColor: traceColor }} />
                              <span className="trace-line-right" style={{ backgroundColor: traceColor }} />
                              <span className="trace-line-top" style={{ backgroundColor: traceColor }} />
                              <span className="trace-line-left" style={{ backgroundColor: traceColor }} />
                            </>
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{session.course?.name || "Unknown Course"}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{session.course?.courseCode} • {session.isOnline ? "Online" : session.classroom}</p>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            {isOngoing ? (
                              hasAttended ? (
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-1 tracking-wider uppercase">ATTENDED</span>
                              ) : (
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-1 tracking-wider uppercase">ONGOING</span>
                              )
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

              <TabsContent value="past" className="p-6 mt-0">
                <div className="flex flex-col gap-4">
                  {classSessions.filter(s => new Date(s.endTime) < currentTime).length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-4">No past classes found.</p>
                  ) : (
                    classSessions
                      .filter(s => new Date(s.endTime) < currentTime)
                      .map((session) => {
                        const startDate = new Date(session.startTime);
                        const endDate = new Date(session.endTime);
                        const dayLabel = startDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                        const timeStr = `${startDate.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}`;
                        
                        const hasAttended = studentAttendances.some((r: any) => r.sessionId === session.id);
                        const isLecturer = user?.role === 'lecturer';
                        const isAttend = isLecturer || hasAttended;

                        return (
                          <div 
                            key={session.id} 
                            className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all duration-300 relative"
                          >
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{session.course?.name || "Unknown Course"}</h3>
                              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{session.course?.courseCode} • {session.isOnline ? "Online" : session.classroom}</p>
                            </div>
                            <div className="text-right flex flex-col items-end">
                              {isAttend ? (
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-1 tracking-wider uppercase">ATTEND</span>
                              ) : (
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-1 tracking-wider uppercase">ABSENT</span>
                              )}
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">{dayLabel}</p>
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
              {user?.role === 'lecturer' ? (
                <>
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Enrolled Students ({modalEnrolledStudents?.length || 0})</h3>
                  
                  {isLoadingModalStudents ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009FE3]" />
                      <p className="text-xs text-slate-400 font-medium">Loading roster...</p>
                    </div>
                  ) : !modalEnrolledStudents || modalEnrolledStudents.length === 0 ? (
                    <p className="text-slate-400 text-center py-6 text-sm">No students currently enrolled.</p>
                  ) : (
                    <div className="space-y-3">
                      {modalEnrolledStudents.map((student: any) => {
                        const isAttended = studentAttendances.some((r: any) => r.studentId === student.id && r.sessionId === selectedSessionForModal.id);
                        return (
                        <div key={student.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                              <AvatarImage src={student.avatarUrl ? (student.avatarUrl.startsWith('http') ? student.avatarUrl : `http://localhost:3000${student.avatarUrl}`) : ""} className="object-cover" />
                              <AvatarFallback className="bg-[#009FE3] text-white text-sm font-semibold">
                                {student.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-left">{student.name}</p>
                              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 text-left">{student.studentId}</p>
                            </div>
                          </div>
                          <div>
                            {isAttended ? (
                              <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-semibold">Attend</span>
                            ) : (
                              <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded text-xs font-semibold">Absent</span>
                            )}
                          </div>
                        </div>
                      )})}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-4 text-center">
                  {(() => {
                    const studentRecord = studentAttendances.find((r: any) => r.sessionId === selectedSessionForModal.id);
                    if (studentRecord) {
                      return (
                        <div className="flex flex-col items-center justify-center py-6 gap-3">
                          <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
                          <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Attendance Verified</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">You signed in successfully using AI face-biometrics.</p>
                          {studentRecord.matchScore && (
                            <span className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-semibold mt-1">
                              Similarity Match: {studentRecord.matchScore}% Confidence
                            </span>
                          )}
                        </div>
                      );
                    }

                    if (isWebcamOpen) {
                      return (
                        <div className="flex flex-col items-center justify-center">
                          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">Position Your Face in Frame</h3>
                          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#009FE3] shadow-md relative bg-slate-950 flex items-center justify-center mb-6">
                            <video 
                              ref={videoRef}
                              autoPlay 
                              playsInline
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <div className="flex gap-3 w-full">
                            <Button 
                              onClick={stopWebcam}
                              variant="outline"
                              className="flex-1 border-slate-300 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={capturePhoto}
                              className="flex-1 bg-[#009FE3] hover:bg-[#008bc6] text-white font-semibold"
                            >
                              Capture
                            </Button>
                          </div>
                        </div>
                      );
                    }

                    if (editorImageSrc) {
                      return (
                        <div className="flex flex-col items-center justify-center">
                          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Align Face for Verification</h3>
                          <p className="text-xs text-slate-400 mb-4 text-center">Drag the photo to align and use the slider to zoom.</p>
                          
                          <div 
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#009FE3] shadow-md relative bg-slate-950 flex items-center justify-center mb-6 cursor-move select-none touch-none"
                          >
                            <img 
                              src={editorImageSrc}
                              draggable={false}
                              style={{
                                width: displayDims.w,
                                height: displayDims.h,
                                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                                transformOrigin: "center center",
                                maxWidth: "none"
                              }}
                              className="select-none pointer-events-none"
                            />
                          </div>
                          
                          <div className="w-full mb-6 flex flex-col gap-1.5">
                            <div className="flex justify-between text-xs text-slate-400 px-1 font-medium">
                              <span>Zoom</span>
                              <span>{Math.round(zoom * 100)}%</span>
                            </div>
                            <input 
                              type="range"
                              min="1"
                              max="3"
                              step="0.01"
                              value={zoom}
                              onChange={(e) => setZoom(parseFloat(e.target.value))}
                              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#009FE3]"
                            />
                          </div>
                          
                          <div className="flex gap-3 w-full">
                            <Button 
                              onClick={() => setEditorImageSrc(null)}
                              variant="outline"
                              className="flex-1 border-slate-300 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                              disabled={isUploading}
                            >
                              Retry
                            </Button>
                            <Button 
                              onClick={handleCropAndVerifyAttendance}
                              className="flex-1 bg-[#009FE3] hover:bg-[#008bc6] text-white font-semibold"
                              disabled={isUploading}
                            >
                              {isUploading ? "Verifying..." : "Verify & Check In"}
                            </Button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="flex flex-col items-center py-6 gap-3">
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Biometric Check In Required</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          To sign in to this ongoing class session, please take a live photo to verify your face matches your active profile picture.
                        </p>
                        
                        {!user?.avatarUrl ? (
                          <div className="w-full mt-3">
                            <p className="text-xs text-red-500 font-medium mb-3">
                              Please upload your profile photo first in the profile section to enable face verification.
                            </p>
                            <Link to="/profile">
                              <Button className="w-full bg-[#009FE3] hover:bg-[#008bc6] text-white font-semibold">
                                Go to Profile
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <Button 
                            onClick={startWebcam}
                            className="mt-3 w-full bg-[#009FE3] hover:bg-[#008bc6] text-white font-semibold flex items-center justify-center gap-2 h-11"
                          >
                            <Camera className="w-5 h-5" />
                            Take Attendance
                          </Button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button 
                onClick={() => {
                  stopWebcam();
                  setEditorImageSrc(null);
                  setSelectedSessionForModal(null);
                }}
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
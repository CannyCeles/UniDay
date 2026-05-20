import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentsPage() {
  const { token } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<any>(null);
  const [studentSessions, setStudentSessions] = useState<any[]>([]);
  const [studentAttendances, setStudentAttendances] = useState<any[]>([]);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:3000/student", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("Students Fetch Response Status:", response.status);
        
        const text = await response.text();
        console.log("Students Fetch Raw Text:", text);

        if (response.ok) {
          const data = JSON.parse(text);
          setStudents(data);
        } else {
           console.error("Fetch failed with status:", response.status, "text:", text);
        }
      } catch (error) {
        console.error("Failed to fetch students error:", error);
      }
    };
    if (token) fetchStudents();
  }, [token]);

  const handleStudentClick = async (student: any) => {
    setSelectedStudentForModal(student);
    setIsLoadingModal(true);
    try {
      const enrollRes = await fetch(`http://localhost:3000/enrollment/student/${student.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const enrolledCourses = enrollRes.ok ? await enrollRes.json() : [];
      const enrolledCourseIds = enrolledCourses.map((c: any) => c.id);

      const sessionsRes = await fetch(`http://localhost:3000/class-session`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allSessions = sessionsRes.ok ? await sessionsRes.json() : [];
      
      const currentTime = new Date();
      const pastSessions = allSessions.filter((s: any) => 
        enrolledCourseIds.includes(s.courseId) && new Date(s.endTime) < currentTime
      );
      
      const attRes = await fetch(`http://localhost:3000/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allAtt = attRes.ok ? await attRes.json() : [];
      const studentAtt = allAtt.filter((a: any) => a.studentId === student.id);

      setStudentSessions(pastSessions.sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()));
      setStudentAttendances(studentAtt);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingModal(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <header className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl items-center font-normal text-slate-700 dark:text-slate-100 tracking-tight">Students</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Directory of all registered students.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <Card key={student.id} onClick={() => handleStudentClick(student)} className="cursor-pointer shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#009FE3]">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-800">
                    <AvatarImage src={student.avatarUrl ? (student.avatarUrl.startsWith('http') ? student.avatarUrl : `http://localhost:3000${student.avatarUrl}`) : ""} className="object-cover" />
                    <AvatarFallback className="bg-[#009FE3] text-white font-medium">
                      {student.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-left">{student.name}</CardTitle>
                    <CardDescription className="text-sm font-mono text-[#009FE3] dark:text-[#33bbf2] text-left mt-0.5">{student.studentId}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">BINUS University</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border border-slate-200 dark:border-slate-800">
                  <AvatarImage src={selectedStudentForModal.avatarUrl ? (selectedStudentForModal.avatarUrl.startsWith('http') ? selectedStudentForModal.avatarUrl : `http://localhost:3000${selectedStudentForModal.avatarUrl}`) : ""} className="object-cover" />
                  <AvatarFallback className="bg-[#009FE3] text-white text-lg font-medium">
                    {selectedStudentForModal.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{selectedStudentForModal.name}</h2>
                  <p className="text-sm font-mono text-[#009FE3] dark:text-[#33bbf2] mt-1">{selectedStudentForModal.studentId}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudentForModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
              >
                <span className="text-xl font-semibold">&times;</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">Past Class History</h3>
              {isLoadingModal ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009FE3]" />
                  <p className="text-xs text-slate-400 font-medium">Loading history...</p>
                </div>
              ) : studentSessions.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-center py-4">No past classes found for this student.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {studentSessions.map((session: any) => {
                    const startDate = new Date(session.startTime);
                    const endDate = new Date(session.endTime);
                    const dayLabel = startDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                    const timeStr = `${startDate.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}`;
                    
                    const hasAttended = studentAttendances.some((r: any) => r.sessionId === session.id);

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
                          {hasAttended ? (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-1 tracking-wider uppercase">ATTEND</span>
                          ) : (
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-1 tracking-wider uppercase">ABSENT</span>
                          )}
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">{dayLabel}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{timeStr}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
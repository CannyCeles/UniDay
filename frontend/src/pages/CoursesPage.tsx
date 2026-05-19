import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Calendar, Clock, X, Plus } from "lucide-react";

export default function CoursesPage() {
  const { user } = useAuth();
  const isLecturer = user?.role === "lecturer";
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [newCourseDetails, setNewCourseDetails] = useState({ name: "", courseCode: "" });

  const [sessionDate, setSessionDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [sessionTime, setSessionTime] = useState("07:20 - 09:00");

  const fetchCourses = async () => {
    console.log("fetchCourses -> Fetching courses list. Role:", user?.role, "user.id:", user?.id);
    try {
      const url = isLecturer 
        ? "http://localhost:3000/course" 
        : `http://localhost:3000/enrollment/student/${user?.id}`;
      console.log("fetchCourses -> Request URL:", url);
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`
        }
      });
      console.log("fetchCourses -> Response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("fetchCourses -> Courses data fetched successfully:", data);
        setCourses(data);
      } else {
        console.error("fetchCourses -> Server error status:", response.status);
      }
    } catch (error) {
      console.error("fetchCourses -> Network error:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const closeDialog = () => setSelectedCourse(null);
  const closeCreateDialog = () => setIsCreatingCourse(false);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: newCourseDetails.name,
          courseCode: newCourseDetails.courseCode,
          lecturerId: user?.id,
        })
      });

      if (response.ok) {
        console.log("Course created successfully!");
        setNewCourseDetails({ name: "", courseCode: "" });
        closeCreateDialog();
        fetchCourses();
      } else {
        const err = await response.text();
        console.error(`Failed to create course: ${err}`);
      }
    } catch (error) {
      console.error("An error occurred while creating the course", error);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const [startHm, endHm] = sessionTime.split(" - ");
    const startTime = new Date(`${sessionDate}T${startHm}:00`).toISOString();
    const endTime = new Date(`${sessionDate}T${endHm}:00`).toISOString();

    console.log("Creating session for:", selectedCourse.id, sessionDate, sessionTime);
    
    try {
      const response = await fetch("http://localhost:3000/class-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          startTime: startTime,
          endTime: endTime
        })
      });

      if (response.ok) {
        console.log(`Successfully scheduled Class Session for ${selectedCourse.name} on ${sessionDate} at ${sessionTime}`);
        closeDialog();
      } else {
        const err = await response.text();
        console.error(`Failed to create session: ${err}`);
      }
    } catch (error) {
      console.error("An error occurred while creating the session", error);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 relative">
      <header className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl items-center font-normal text-slate-700 dark:text-slate-100 tracking-tight">
            {isLecturer ? "All Courses" : "My Enrolled Courses"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {isLecturer ? "Select a course to schedule a class session." : "Displaying all currently enrolled courses."}
          </p>
        </div>
        {isLecturer && (
          <Button onClick={() => setIsCreatingCourse(true)} className="bg-[#009FE3] hover:bg-[#008bc6] flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Course
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card 
            key={course.id} 
            onClick={() => isLecturer && setSelectedCourse(course)}
            className={`shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-md transition-all ${isLecturer ? 'cursor-pointer hover:border-[#009FE3] dark:hover:border-[#009FE3] hover:shadow-md' : ''}`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">{course.name}</CardTitle>
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                  {course.type || "LEC"}
                </Badge>
              </div>
              <CardDescription className="text-sm font-mono text-slate-500 dark:text-slate-400">{course.courseCode}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{course.credits || 3} Credits</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Lecturer: <span className="font-semibold text-slate-700 dark:text-slate-300">{course.lecturer?.name || "N/A"}</span></span>
              </div>
              {isLecturer && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-[#009FE3] font-medium">
                  <span>Create Class Session &rarr;</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isCreatingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-white dark:bg-slate-900 shadow-lg animate-in fade-in zoom-in duration-200 border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100">Create New Course</CardTitle>
                <CardDescription className="mt-1 dark:text-slate-400">
                  Add a new course to the database.
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={closeCreateDialog} className="h-8 w-8 rounded-full dark:hover:bg-slate-800 dark:text-slate-400">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCreateCourse} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Course Code</label>
                  <input 
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input dark:border-slate-700 bg-background dark:bg-slate-800 px-3 py-2 text-sm dark:text-slate-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newCourseDetails.courseCode}
                    onChange={(e) => setNewCourseDetails({ ...newCourseDetails, courseCode: e.target.value })}
                    required
                    placeholder="e.g. COMP6083001"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Course Name</label>
                  <input 
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input dark:border-slate-700 bg-background dark:bg-slate-800 px-3 py-2 text-sm dark:text-slate-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newCourseDetails.name}
                    onChange={(e) => setNewCourseDetails({ ...newCourseDetails, name: e.target.value })}
                    required
                    placeholder="e.g. Database Systems"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={closeCreateDialog} className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</Button>
                  <Button type="submit" className="bg-[#009FE3] hover:bg-[#008bc6] text-white">Create Course</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCourse && isLecturer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-white dark:bg-slate-900 shadow-lg animate-in fade-in zoom-in duration-200 border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100">Assign Class Session</CardTitle>
                <CardDescription className="mt-1 dark:text-slate-400">
                  Schedule details for <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedCourse.name}</span>
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={closeDialog} className="h-8 w-8 rounded-full dark:hover:bg-slate-800 dark:text-slate-400">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCreateSession} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#009FE3]" /> Select Date
                  </label>
                  <input 
                    type="date"
                    className="flex h-10 w-full rounded-md border border-input dark:border-slate-700 bg-background dark:bg-slate-800 px-3 py-2 text-sm dark:text-slate-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#009FE3]" /> Select Time Slot
                  </label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input dark:border-slate-700 bg-background dark:bg-slate-800 px-3 py-2 text-sm dark:text-slate-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                  >
                    <option value="07:20 - 09:00">07:20 - 09:00</option>
                    <option value="09:20 - 11:00">09:20 - 11:00</option>
                    <option value="11:20 - 13:00">11:20 - 13:00</option>
                    <option value="13:20 - 15:00">13:20 - 15:00</option>
                    <option value="15:20 - 17:00">15:20 - 17:00</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={closeDialog} className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</Button>
                  <Button type="submit" className="bg-[#009FE3] hover:bg-[#008bc6] text-white">Create Session</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
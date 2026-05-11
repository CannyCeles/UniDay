import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Calendar, Clock, X } from "lucide-react";

export default function CoursesPage() {
  const { user } = useAuth();
  const isLecturer = user?.role === "lecturer";
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const [sessionDay, setSessionDay] = useState("Monday");
  const [sessionTime, setSessionTime] = useState("07:20 - 09:00");

  const closeDialog = () => setSelectedCourse(null);

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating session for:", selectedCourse.id, sessionDay, sessionTime);
    alert(`Class Session Scheduled for ${selectedCourse.name} on ${sessionDay} at ${sessionTime}`);
    setSelectedCourse(null);
  };

  const courses = [
    {
      id: "COMP6100001",
      name: "Software Engineering",
      type: "LAB",
      credits: 4,
    },
    {
      id: "COMP6083001",
      name: "Database Systems",
      type: "LEC",
      credits: 3,
    },
    {
      id: "COMP6065001",
      name: "Artificial Intelligence",
      type: "LEC",
      credits: 4,
    }
  ];

  return (
    <div className="flex flex-col w-full gap-6 relative">
      <header className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl items-center font-normal text-slate-700 tracking-tight">
            {isLecturer ? "All Courses" : "My Enrolled Courses"}
          </h1>
          <p className="text-slate-500 mt-1">
            {isLecturer ? "Select a course to schedule a class session." : "Displaying all currently enrolled courses."}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card 
            key={course.id} 
            onClick={() => isLecturer && setSelectedCourse(course)}
            className={`shadow-sm border border-slate-200 bg-white rounded-md transition-all ${isLecturer ? 'cursor-pointer hover:border-[#009FE3] hover:shadow-md' : ''}`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold text-slate-800">{course.name}</CardTitle>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {course.type}
                </Badge>
              </div>
              <CardDescription className="text-sm font-mono text-slate-500">{course.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 font-medium">{course.credits} Credits</p>
              {isLecturer && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm text-[#009FE3] font-medium">
                  <span>Create Class Session &rarr;</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCourse && isLecturer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-white shadow-lg animate-in fade-in zoom-in duration-200">
            <CardHeader className="flex flex-row items-start justify-between border-b pb-4">
              <div>
                <CardTitle className="text-xl text-slate-800">Assign Class Session</CardTitle>
                <CardDescription className="mt-1">
                  Schedule details for <span className="font-semibold text-slate-700">{selectedCourse.name}</span>
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={closeDialog} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCreateSession} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#009FE3]" /> Select Day
                  </label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={sessionDay}
                    onChange={(e) => setSessionDay(e.target.value)}
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#009FE3]" /> Select Time Slot
                  </label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                  <Button type="submit" className="bg-[#009FE3] hover:bg-[#008bc6]">Create Session</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
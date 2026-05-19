import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentsPage() {
  const { token } = useAuth();
  const [students, setStudents] = useState<any[]>([]);

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
          <Card key={student.id} className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#009FE3]">
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
    </div>
  );
}
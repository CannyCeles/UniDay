import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState({ studentId: "", password: "" });
  const [lecturerData, setLecturerData] = useState({ lecturerId: "", password: "" });

  const handleStudentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStudentData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLecturerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLecturerData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStudentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...studentData, role: 'student' }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Login failed");
        return;
      }

      console.log("Login Student success");
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleLecturerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lecturerData, role: 'lecturer' }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Login failed");
        return;
      }

      console.log("Login Lecturer success");
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-sky-50 text-slate-800 py-12 font-sans">
      <Card className="w-[420px] shadow-sm border border-slate-200 bg-white rounded-md">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-normal text-slate-700 tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-slate-500">Log in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-50 p-1 rounded-md border border-slate-100">
              <TabsTrigger 
                value="student" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-sm transition-all"
              >
                Student
              </TabsTrigger>
              <TabsTrigger 
                value="lecturer" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-sm transition-all"
              >
                Lecturer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="font-normal text-slate-600">Student ID</Label>
                  <Input
                    id="studentId"
                    type="text"
                    name="studentId"
                    placeholder="Enter Student ID"
                    value={studentData.studentId}
                    onChange={handleStudentChange}
                    required
                    className="border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password" className="font-normal text-slate-600">Password</Label>
                  <Input
                    id="student-password"
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    value={studentData.password}
                    onChange={handleStudentChange}
                    required
                    className="border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Log In As Student
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="lecturer">
              <form onSubmit={handleLecturerSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lecturerId" className="font-normal text-slate-600">Lecturer ID</Label>
                  <Input
                    id="lecturerId"
                    type="text"
                    name="lecturerId"
                    placeholder="Enter Lecturer ID"
                    value={lecturerData.lecturerId}
                    onChange={handleLecturerChange}
                    required
                    className="border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lecturer-password" className="font-normal text-slate-600">Password</Label>
                  <Input
                    id="lecturer-password"
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    value={lecturerData.password}
                    onChange={handleLecturerChange}
                    required
                    className="border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Log In As Lecturer
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
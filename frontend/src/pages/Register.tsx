import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Register() {
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState({
    studentId: "",
    name: "",
    email: "",
    password: "",
  });

  const [lecturerData, setLecturerData] = useState({
    lecturerId: "",
    name: "",
    email: "",
    password: "",
  });

  const handleStudentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStudentData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLecturerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLecturerData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStudentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // TODO: Implement actual backend registration for student
      console.log("Register Student", studentData);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLecturerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // TODO: Implement actual backend registration for lecturer
      console.log("Register Lecturer", lecturerData);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-sky-50 text-slate-800 py-12 font-sans">
      <Card className="w-[450px] shadow-sm border border-slate-200 bg-white rounded-md">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-normal text-slate-700 tracking-tight">Create an Account</CardTitle>
          <CardDescription className="text-slate-500">Register as a new user</CardDescription>
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
                    name="studentId"
                    type="text"
                    placeholder="Enter Student ID"
                    value={studentData.studentId}
                    onChange={handleStudentChange}
                    required
                    className="border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-name" className="font-normal text-slate-600">Full Name</Label>
                  <Input
                    id="student-name"
                    name="name"
                    type="text"
                    placeholder="Enter Full Name"
                    value={studentData.name}
                    onChange={handleStudentChange}
                    required
                    className="border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-email" className="font-normal text-slate-600">Email Address</Label>
                  <Input
                    id="student-email"
                    name="email"
                    type="email"
                    placeholder="student@example.com"
                    value={studentData.email}
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
                    placeholder="Create a password"
                    value={studentData.password}
                    onChange={handleStudentChange}
                    required
                    className="border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
                <Button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                  Sign Up As Student
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="lecturer">
              <form onSubmit={handleLecturerSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lecturerId" className="font-normal text-slate-600">Lecturer ID</Label>
                  <Input
                    id="lecturerId"
                    name="lecturerId"
                    type="text"
                    placeholder="Enter Lecturer ID"
                    value={lecturerData.lecturerId}
                    onChange={handleLecturerChange}
                    required
                    className="border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lecturer-name" className="font-normal text-slate-600">Full Name</Label>
                  <Input
                    id="lecturer-name"
                    name="name"
                    type="text"
                    placeholder="Enter Full Name"
                    value={lecturerData.name}
                    onChange={handleLecturerChange}
                    required
                    className="border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lecturer-email" className="font-normal text-slate-600">Email Address</Label>
                  <Input
                    id="lecturer-email"
                    name="email"
                    type="email"
                    placeholder="lecturer@example.com"
                    value={lecturerData.email}
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
                    placeholder="Create a password"
                    value={lecturerData.password}
                    onChange={handleLecturerChange}
                    required
                    className="border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
                <Button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                  Sign Up As Lecturer
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Log in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
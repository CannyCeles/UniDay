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
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 text-slate-900 py-12">
      <Card className="w-[450px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">Create an Account</CardTitle>
          <CardDescription>Register as a new user</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="lecturer">Lecturer</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    name="studentId"
                    type="text"
                    placeholder="Enter Student ID"
                    value={studentData.studentId}
                    onChange={handleStudentChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-name">Full Name</Label>
                  <Input
                    id="student-name"
                    name="name"
                    type="text"
                    placeholder="Enter Full Name"
                    value={studentData.name}
                    onChange={handleStudentChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email Address</Label>
                  <Input
                    id="student-email"
                    name="email"
                    type="email"
                    placeholder="student@example.com"
                    value={studentData.email}
                    onChange={handleStudentChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <Input
                    id="student-password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={studentData.password}
                    onChange={handleStudentChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full mt-2">
                  Sign Up As Student
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="lecturer">
              <form onSubmit={handleLecturerSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lecturerId">Lecturer ID</Label>
                  <Input
                    id="lecturerId"
                    name="lecturerId"
                    type="text"
                    placeholder="Enter Lecturer ID"
                    value={lecturerData.lecturerId}
                    onChange={handleLecturerChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lecturer-name">Full Name</Label>
                  <Input
                    id="lecturer-name"
                    name="name"
                    type="text"
                    placeholder="Enter Full Name"
                    value={lecturerData.name}
                    onChange={handleLecturerChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lecturer-email">Email Address</Label>
                  <Input
                    id="lecturer-email"
                    name="email"
                    type="email"
                    placeholder="lecturer@example.com"
                    value={lecturerData.email}
                    onChange={handleLecturerChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lecturer-password">Password</Label>
                  <Input
                    id="lecturer-password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={lecturerData.password}
                    onChange={handleLecturerChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full mt-2">
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
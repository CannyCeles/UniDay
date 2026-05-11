import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; 

export default function Login() {
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState({ email: "", password: "" });
  const [lecturerData, setLecturerData] = useState({ email: "", password: "" });

  const handleStudentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStudentData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLecturerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLecturerData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStudentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // TODO: Implement actual backend login for student
      console.log("Login Student", studentData);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLecturerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // TODO: Implement actual backend login for lecturer
      console.log("Login Lecturer", lecturerData);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-slate-900">
      <Card className="w-[420px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">Welcome Back</CardTitle>
          <CardDescription>Log in to your account</CardDescription>
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
                  <Label htmlFor="student-email">Email Address</Label>
                  <Input
                    id="student-email"
                    type="email"
                    name="email"
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
                    placeholder="Enter Password"
                    value={studentData.password}
                    onChange={handleStudentChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Log In As Student
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="lecturer">
              <form onSubmit={handleLecturerSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lecturer-email">Email Address</Label>
                  <Input
                    id="lecturer-email"
                    type="email"
                    name="email"
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
                    placeholder="Enter Password"
                    value={lecturerData.password}
                    onChange={handleLecturerChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
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
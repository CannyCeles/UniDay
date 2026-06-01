import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const STAR_COUNT = 80;
const CONNECT_DIST = 120;
const LINE_ALPHA_MAX = 0.35;
const STAR_SPEED = 0.4;
const STAR_RADIUS_MIN = 0.8;
const STAR_RADIUS_MAX = 1.8;
const MOUSE_ATTRACT_DIST = 140;
const MOUSE_ATTRACT_STRENGTH = 0.06;

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

function initStars(w: number, h: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * STAR_SPEED,
    vy: (Math.random() - 0.5) * STAR_SPEED,
    r: Math.random() * (STAR_RADIUS_MAX - STAR_RADIUS_MIN) + STAR_RADIUS_MIN,
  }));
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const isDarkRef = useRef(isDarkMode);

  useEffect(() => {
    isDarkRef.current = isDarkMode;
  }, [isDarkMode]);

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...studentData, role: "student" }),
      });
      if (!response.ok) {
        const error = await response.json();
        console.error(error.message || "Login failed");
        return;
      }
      const data = await response.json();
      login(data.access_token, data.user);
      navigate("/home");
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const handleLecturerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lecturerData, role: "lecturer" }),
      });
      if (!response.ok) {
        const error = await response.json();
        console.error(error.message || "Login failed");
        return;
      }
      const data = await response.json();
      login(data.access_token, data.user);
      navigate("/home");
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = initStars(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      const mouse = mouseRef.current;
      const stars = starsRef.current;

      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < MOUSE_ATTRACT_DIST) {
          const force = (MOUSE_ATTRACT_DIST - d) / MOUSE_ATTRACT_DIST;
          s.x += (mouse.x - s.x) * force * MOUSE_ATTRACT_STRENGTH;
          s.y += (mouse.y - s.y) * force * MOUSE_ATTRACT_STRENGTH;
        } else {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0 || s.x > w) s.vx *= -1;
          if (s.y < 0 || s.y > h) s.vy *= -1;
        }
      }

      ctx.lineWidth = 0.6;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * LINE_ALPHA_MAX;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = isDarkRef.current 
              ? `rgba(180, 215, 255, ${alpha})` 
              : `rgba(15, 23, 42, ${alpha * 0.8})`;
            ctx.stroke();
          }
        }
      }

      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = isDarkRef.current 
          ? "rgba(200, 225, 255, 0.75)" 
          : "rgba(15, 23, 42, 0.4)";
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-sky-50 dark:bg-[#0d1f3c] text-slate-800 dark:text-white py-12 font-sans overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <Card
        className="relative w-[420px] shadow-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 rounded-md"
        style={{ zIndex: 1 }}
      >
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-normal text-slate-700 dark:text-slate-100 tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Log in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-50 dark:bg-slate-800 p-1 rounded-md border border-slate-100 dark:border-slate-700">
              <TabsTrigger
                value="student"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-sm transition-all"
              >
                Student
              </TabsTrigger>
              <TabsTrigger
                value="lecturer"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-sm transition-all"
              >
                Lecturer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="font-normal text-slate-600 dark:text-slate-300">
                    Student ID
                  </Label>
                  <Input
                    id="studentId"
                    type="text"
                    name="studentId"
                    placeholder="Enter Student ID"
                    value={studentData.studentId}
                    onChange={handleStudentChange}
                    required
                    className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password" className="font-normal text-slate-600 dark:text-slate-300">
                    Password
                  </Label>
                  <Input
                    id="student-password"
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    value={studentData.password}
                    onChange={handleStudentChange}
                    required
                    className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-blue-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
                  Log In As Student
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="lecturer">
              <form onSubmit={handleLecturerSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lecturerId" className="font-normal text-slate-600 dark:text-slate-300">
                    Lecturer ID
                  </Label>
                  <Input
                    id="lecturerId"
                    type="text"
                    name="lecturerId"
                    placeholder="Enter Lecturer ID"
                    value={lecturerData.lecturerId}
                    onChange={handleLecturerChange}
                    required
                    className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lecturer-password" className="font-normal text-slate-600 dark:text-slate-300">
                    Password
                  </Label>
                  <Input
                    id="lecturer-password"
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    value={lecturerData.password}
                    onChange={handleLecturerChange}
                    required
                    className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-blue-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
                  Log In As Lecturer
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
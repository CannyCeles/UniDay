import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

export default function Register() {
  const navigate = useNavigate();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

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

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleStudentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStudentData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLecturerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLecturerData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStudentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register/student`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );

      if (!response.ok) {
        const error = await response.json();

        console.error(error.message || "Registration failed");

        return;
      }

      console.log("Registered Student successfully");

      navigate("/login");
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const handleLecturerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register/lecturer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(lecturerData),
        }
      );

      if (!response.ok) {
        const error = await response.json();

        console.error(error.message || "Registration failed");

        return;
      }

      console.log("Registered Lecturer successfully");

      navigate("/login");
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
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = {
        x: -9999,
        y: -9999,
      };
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

          if (s.x < 0 || s.x > w) {
            s.vx *= -1;
          }

          if (s.y < 0 || s.y > h) {
            s.vy *= -1;
          }
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

            ctx.strokeStyle = `rgba(180, 215, 255, ${alpha})`;

            ctx.stroke();
          }
        }
      }

      for (const s of stars) {
        ctx.beginPath();

        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);

        ctx.fillStyle = "rgba(200, 225, 255, 0.75)";

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
    <div
      className={`relative flex min-h-screen w-full items-center justify-center py-12 font-sans overflow-hidden ${
        isDarkMode ? "dark" : ""
      }`}
      style={{
        backgroundColor: isDarkMode ? "#0d1f3c" : "#e0f2fe",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <Card
        className="
          relative w-[450px] shadow-lg rounded-md
          border border-slate-200 dark:border-white/10
          bg-white dark:bg-slate-900
        "
        style={{ zIndex: 1 }}
      >
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-normal text-slate-700 dark:text-slate-100 tracking-tight">
            Create an Account
          </CardTitle>

          <CardDescription className="text-slate-500 dark:text-slate-400">
            Register as a new user
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList
              className="
                grid w-full grid-cols-2 mb-6 p-1 rounded-md
                bg-slate-50 dark:bg-slate-800
                border border-slate-100 dark:border-slate-700
              "
            >
              <TabsTrigger
                value="student"
                className="
                  rounded-sm transition-all
                  data-[state=active]:bg-white
                  dark:data-[state=active]:bg-slate-900
                  data-[state=active]:text-blue-600
                  dark:data-[state=active]:text-blue-400
                  data-[state=active]:shadow-sm
                "
              >
                Student
              </TabsTrigger>

              <TabsTrigger
                value="lecturer"
                className="
                  rounded-sm transition-all
                  data-[state=active]:bg-white
                  dark:data-[state=active]:bg-slate-900
                  data-[state=active]:text-blue-600
                  dark:data-[state=active]:text-blue-400
                  data-[state=active]:shadow-sm
                "
              >
                Lecturer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form
                onSubmit={handleStudentSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="studentId"
                    className="font-normal text-slate-600 dark:text-slate-300"
                  >
                    Student ID
                  </Label>

                  <Input
                    id="studentId"
                    name="studentId"
                    type="text"
                    placeholder="Enter Student ID"
                    value={studentData.studentId}
                    onChange={handleStudentChange}
                    required
                    className="
                      border-slate-200 dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                      focus-visible:ring-blue-500
                    "
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="student-name"
                    className="font-normal text-slate-600 dark:text-slate-300"
                  >
                    Full Name
                  </Label>

                  <Input
                    id="student-name"
                    name="name"
                    type="text"
                    placeholder="Enter Full Name"
                    value={studentData.name}
                    onChange={handleStudentChange}
                    required
                    className="
                      border-slate-200 dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                      focus-visible:ring-blue-500
                    "
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="student-email"
                    className="font-normal text-slate-600 dark:text-slate-300"
                  >
                    Email Address
                  </Label>

                  <Input
                    id="student-email"
                    name="email"
                    type="email"
                    placeholder="student@example.com"
                    value={studentData.email}
                    onChange={handleStudentChange}
                    required
                    className="
                      border-slate-200 dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                      focus-visible:ring-blue-500
                    "
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="student-password"
                    className="font-normal text-slate-600 dark:text-slate-300"
                  >
                    Password
                  </Label>

                  <Input
                    id="student-password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={studentData.password}
                    onChange={handleStudentChange}
                    required
                    className="
                      border-slate-200 dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                      focus-visible:ring-blue-500
                    "
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign Up As Student
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="lecturer">
              <form
                onSubmit={handleLecturerSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="lecturerId"
                    className="font-normal text-slate-600 dark:text-slate-300"
                  >
                    Lecturer ID
                  </Label>

                  <Input
                    id="lecturerId"
                    name="lecturerId"
                    type="text"
                    placeholder="Enter Lecturer ID"
                    value={lecturerData.lecturerId}
                    onChange={handleLecturerChange}
                    required
                    className="
                      border-slate-200 dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                      focus-visible:ring-blue-500
                    "
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lecturer-name"
                    className="font-normal text-slate-600 dark:text-slate-300"
                  >
                    Full Name
                  </Label>

                  <Input
                    id="lecturer-name"
                    name="name"
                    type="text"
                    placeholder="Enter Full Name"
                    value={lecturerData.name}
                    onChange={handleLecturerChange}
                    required
                    className="
                      border-slate-200 dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                      focus-visible:ring-blue-500
                    "
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lecturer-email"
                    className="font-normal text-slate-600 dark:text-slate-300"
                  >
                    Email Address
                  </Label>

                  <Input
                    id="lecturer-email"
                    name="email"
                    type="email"
                    placeholder="lecturer@example.com"
                    value={lecturerData.email}
                    onChange={handleLecturerChange}
                    required
                    className="
                      border-slate-200 dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                      focus-visible:ring-blue-500
                    "
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lecturer-password"
                    className="font-normal text-slate-600 dark:text-slate-300"
                  >
                    Password
                  </Label>

                  <Input
                    id="lecturer-password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={lecturerData.password}
                    onChange={handleLecturerChange}
                    required
                    className="
                      border-slate-200 dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                      focus-visible:ring-blue-500
                    "
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign Up As Lecturer
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Log in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
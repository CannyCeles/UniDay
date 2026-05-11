import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CoursesPage() {
  const enrolledCourses = [
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
    <div className="flex flex-col w-full gap-6">
      <header className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl items-center font-normal text-slate-700 tracking-tight">Courses</h1>
          <p className="text-slate-500 mt-1">Displaying all currently enrolled courses.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <Card key={course.id} className="shadow-sm border border-slate-200 bg-white rounded-md">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
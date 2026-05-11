import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const fullName = user?.name || "User";

  return (
    <div className="flex flex-col w-full gap-6">
      <header className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-3xl items-center font-normal text-slate-700 tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link to="/profile">
            <Avatar className="h-8 w-8 border border-slate-200 cursor-pointer hover:ring-2 hover:ring-[#009FE3] transition-all">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#009FE3] text-white text-xs">
                {fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <span className="text-slate-600 text-sm hidden sm:block">Welcome, {fullName}</span>
        </div>
      </header>
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="md:col-span-2">
          <Card className="shadow-sm border border-slate-200 bg-white min-h-[500px] text-slate-800 rounded-md">
            <Tabs defaultValue="classes" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-t-md rounded-b-none bg-slate-50 p-0 h-auto border-b border-slate-200">
                <TabsTrigger 
                  value="classes"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#009FE3] data-[state=active]:border-b-2 data-[state=active]:border-[#009FE3] py-4 rounded-none transition-all text-slate-500 hover:text-slate-700"
                >
                  View Upcoming Classes
                </TabsTrigger>
                <TabsTrigger 
                  value="enrollment"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#009FE3] data-[state=active]:border-b-2 data-[state=active]:border-[#009FE3] py-4 rounded-none transition-all text-slate-500 hover:text-slate-700"
                >
                  Course Enrollment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="classes" className="p-6 mt-0">
                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Software Engineering</h3>
                      <p className="text-slate-500 text-sm mt-1">COMP6100001 • LAB</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="bg-emerald-100/80 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mb-1">Today</span>
                      <p className="text-sm text-emerald-600 font-medium">10:00 - 11:40 AM</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Database Systems</h3>
                      <p className="text-slate-500 text-sm mt-1">COMP6083001 • LEC</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="bg-orange-100/80 text-orange-700 px-3 py-1 rounded-full text-sm font-medium mb-1">Tomorrow</span>
                      <p className="text-sm text-orange-600 font-medium">13:00 - 14:40 PM</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="enrollment" className="p-6 mt-0">
                <div className="flex flex-col gap-4 text-center py-12">
                  <p className="text-slate-500">Registration opens next week.</p>
                  <Button variant="outline" className="mx-auto bg-[#009FE3] text-white border-transparent hover:bg-[#008bc6] hover:text-white mt-4 w-fit">
                    View Course Catalog
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="shadow-sm border border-slate-200 bg-white min-h-[500px] text-slate-800 rounded-md">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-xl font-normal text-slate-700 flex justify-between items-center">
                To-Do
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-5">
                <li>
                  <Link to="/profile" className="flex items-center gap-3 group">
                    <div className="h-4 w-4 rounded-full border-2 border-slate-300 group-hover:border-[#009FE3] transition-colors"></div>
                    <span className="text-slate-600 font-medium group-hover:text-[#009FE3] transition-colors">Upload profile photo</span>
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="flex items-center gap-3 group">
                    <div className="h-4 w-4 rounded-full border-2 border-slate-300 group-hover:border-[#009FE3] transition-colors"></div>
                    <span className="text-slate-600 font-medium group-hover:text-[#009FE3] transition-colors">Enroll in new course</span>
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
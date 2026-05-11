import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const fullName = "John Doe";
  const studentId = "2501987654";
  const email = "john.doe@binus.ac.id";

  return (
    <div className="flex flex-col w-full gap-6">
      <header className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl items-center font-normal text-slate-700 tracking-tight">Profile</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border border-slate-200 bg-white rounded-md md:col-span-1 border-t-4 border-t-[#009FE3]">
          <CardContent className="pt-8 flex flex-col items-center justify-center text-center">
            <Avatar className="h-32 w-32 mb-4 border-4 border-white shadow-sm">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#009FE3] text-white text-4xl">JD</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold text-slate-800">{fullName}</h2>
            <p className="text-slate-500 font-medium mt-1">Student ID: {studentId}</p>
            <Button className="mt-6 w-full bg-[#009FE3] hover:bg-[#008bc6]">Upload Profile Photo</Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200 bg-white rounded-md md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-normal text-slate-700">Personal Information</CardTitle>
            <CardDescription>Your personal details and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500">Full Name</label>
                <p className="text-slate-800 mt-1">{fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Email Address</label>
                <p className="text-slate-800 mt-1">{email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Role</label>
                <p className="text-slate-800 mt-1">Student</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Campus</label>
                <p className="text-slate-800 mt-1">BINUS University</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, GraduationCap, Building, IdCard } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  
  console.log("ProfilePage -> current user from AuthContext:", user);

  const fullName = user?.name || "User";
  const studentId = user?.userId || "N/A";
  const email = user?.email;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/biometric/upload-photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Uploaded file response:", data);
        if (data.avatarUrl) {
          updateUser({ avatarUrl: data.avatarUrl });
          console.log("Profile updated successfully");
        }
      } else {
        console.error("Failed to upload photo.");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <header className="pb-4 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-3xl items-center font-normal text-slate-700 dark:text-slate-100 tracking-tight">Profile</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-md md:col-span-1 border-t-4 border-t-[#009FE3] dark:border-t-[#009FE3]">
          <CardContent className="pt-8 flex flex-col items-center justify-center text-center">
            <Avatar className="h-32 w-32 mb-4 border-4 border-white dark:border-slate-800 shadow-sm">
              <AvatarImage src={user?.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:3000${user.avatarUrl}`) : ""} className="object-cover" />
              <AvatarFallback className="bg-[#009FE3] text-white text-4xl">
                {fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{fullName}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">ID: {studentId}</p>
            
            <div className="mt-6 w-full relative">
              <input 
                type="file" 
                id="profile-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload}
              />
              <label 
                htmlFor="profile-upload" 
                className="flex items-center justify-center w-full h-10 px-4 py-2 bg-[#009FE3] text-white rounded-md hover:bg-[#008bc6] cursor-pointer transition-colors text-sm font-medium"
              >
                Upload Profile Photo
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-md md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-normal text-slate-700 dark:text-slate-100 flex items-center gap-2">
              <IdCard className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              Personal Information
            </CardTitle>
            <CardDescription className="dark:text-slate-400">Your personal details and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                <p className="text-slate-800 dark:text-slate-200 mt-1 pl-6">{fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </label>
                <p className="text-slate-800 dark:text-slate-200 mt-1 pl-6">{email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> Role
                </label>
                <p className="text-slate-800 dark:text-slate-200 mt-1 pl-6 capitalize">{user?.role || "Student"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Building className="w-4 h-4" /> Campus
                </label>
                <p className="text-slate-800 dark:text-slate-200 mt-1 pl-6">BINUS University</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
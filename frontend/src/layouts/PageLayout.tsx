import { Outlet } from "react-router-dom";
import Sidebar from "@/components/SideBar";

export default function PageLayout() {
  return (
    <div className="flex h-screen w-full bg-[#f4f5f7] text-slate-800 font-sans">
      <aside className="w-64 flex-shrink-0 shadow-md z-10 relative">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-y-auto w-full">
        <div className="container mx-auto p-4 md:p-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Bell, User as UserIcon, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  const getPageTitle = () => {
    if (pathname === "/" || pathname === "/dashboard") return { title: "Dashboard", sub: "Welcome back to VitaScan AI", hideBack: true };
    if (pathname.includes("/new-scan")) return { title: "New Diagnostic Scan", sub: "Upload medical data for AI analysis" };
    if (pathname.includes("/reports")) return { title: "Medical Reports", sub: "Review patient scan results" };
    if (pathname.includes("/appointments")) return { title: "Appointments", sub: "Manage patient visits" };
    if (pathname.includes("/profile")) return { title: "Provider Profile", sub: "Manage your credentials and settings" };
    return { title: "Portal", sub: "VitaScan AI Workspace" };
  };

  const { title, sub } = getPageTitle();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all h-20">
      <div className="flex items-center justify-between h-full px-8">
        
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Mobile menu trigger could go here if needed */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            <p className="text-sm font-medium text-gray-500">
              {sub}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">

          <div className="hidden lg:flex items-center bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all rounded-full px-5 py-2.5 w-64">
            <Search size={18} className="text-gray-400 mr-3" />
            <input
              placeholder="Search patients, scans..."
              className="bg-transparent outline-none text-sm w-full font-medium placeholder:text-gray-400 text-gray-700"
            />
          </div>

          <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors hidden md:block">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="w-px h-8 bg-gray-200 mx-1 hidden md:block"></div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all ring-4 ring-white">
                  <UserIcon size={18} />
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-gray-800 text-sm leading-tight">
                    Dr. Provider
                  </p>
                  <p className="text-xs font-medium text-blue-600">
                    Active Session
                  </p>
                </div>
                <ChevronDown size={16} className="text-gray-400 hidden md:block" />
              </div>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors tooltip"
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          )}

        </div>

      </div>
    </nav>
  );
}
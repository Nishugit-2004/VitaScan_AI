"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

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

  return (
    <nav className="bg-white shadow-sm h-16 flex items-center px-6">
      <Link href="/" className="text-xl font-bold text-blue-600">
        VitaScan AI
      </Link>

      <div className="ml-auto">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-red-600 font-medium"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
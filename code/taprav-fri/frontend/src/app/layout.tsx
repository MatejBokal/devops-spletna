// src/app/layout.tsx
"use client";

import "./globals.css";
import Footer from "@/components/Footer";
import AuthWrapper from "@/components/AuthWrapper";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loginCounter, setLoginCounter] = useState(0);

  async function handleLogout() {
    if (typeof window === "undefined") return;

    try {
      const res = await fetch("/taprav-fri/api/logout.php", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("isAdmin");

        setLoginCounter((c) => c + 1);

        window.location.reload();
        
      } else {
        console.error("PHP logout returned an error:", data.error);
      }
    } catch (err: any) {
      console.error("Logout failed:", err.message);
    }
  }

  return (
    <html lang="sl">
      <body className="bg-white text-gray-800">
        <AuthWrapper
          incrementLogin={() => setLoginCounter((c) => c + 1)}
          loginCounter={loginCounter}
          onLogout={handleLogout}
        >
          <main>{children}</main>
          <Footer />
        </AuthWrapper>
      </body>
    </html>
  );
}

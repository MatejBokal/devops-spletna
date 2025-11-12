// src/app/components/Auth.tsx
"use client";

import { useState, useEffect } from "react";
import LoginForm from "@/components/small/LoginForm";
import RegisterForm from "@/components/small/RegisterForm";

type AuthMode = "login" | "register";

export default function Auth({
  mode,
  onClose,
  onSuccess,
  loginCounter,
}: {
  mode: AuthMode;
  onClose: () => void;
  onSuccess: () => void;
  loginCounter?: number;
}) {
  const [authMode, setAuthMode] = useState<AuthMode>(mode);

  useEffect(() => {
    setAuthMode(mode);
  }, [mode]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      key={authMode}                         
      className="
        fixed inset-0 z-70 flex items-center justify-center
        bg-black/50
      "
      onClick={onClose}
    >
      <div
        className="
          bg-white
          w-full h-full
          md:w-96 md:max-w-md md:rounded-lg md:shadow-xl md:h-auto
          overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-2xl font-bold">
            {authMode === "login" ? "Prijava" : "Registracija"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Zapri"
          >
            ✕
          </button>
        </div>

        <div key={authMode} className="px-6 py-4">
          {authMode === "login" ? (
            <LoginForm
              onSwitch={() => setAuthMode("register")}
              onSuccess={onSuccess}
            />
          ) : (
            <RegisterForm
              onSwitch={() => setAuthMode("login")}
              onSuccess={onSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}

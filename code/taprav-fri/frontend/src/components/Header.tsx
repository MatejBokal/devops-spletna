// src/components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header({
  showAuthSetter,
  loginCounter,
  onLogout,
}: {
  showAuthSetter: (mode: "login" | "register" | null) => void;
  loginCounter: number;
  onLogout: () => Promise<void>;
}) {
  const pathName = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("loggedIn") === "true"
    ) {
      setIsLoggedIn(true);
      setFirstName(localStorage.getItem("firstName"));
      setLastName(localStorage.getItem("lastName"));
    } else {
      setIsLoggedIn(false);
      setFirstName(null);
      setLastName(null);
    }
  }, [loginCounter]);

  function getLogo() {
    if (pathName.startsWith("/zibert")) return "/slike/logo-zibert.png";
    if (pathName.startsWith("/drive-in")) return "/slike/logo-drive-in.png";
    if (pathName.startsWith("/rooms")) return "/slike/logo-rooms.png";
    if (pathName.startsWith("/dogodki")) return "/slike/logo-dogodki.png";
    return "/slike/logo-taprav.png";
  }

  async function handleConfirmLogout() {
    await onLogout();
  }

  return (
    <header className="bg-white relative">
      <div className="px-4 py-2 flex justify-center">
        <Link href="/">
          <Image
            src={getLogo()}
            alt="Logo"
            width={150}
            height={50}
            className="h-auto w-auto"
            priority
          />
        </Link>
      </div>

      <div className="hidden md:block md:fixed md:top-4 md:right-4 z-60">
        {isLoggedIn && firstName && lastName ? (
          <div className="relative inline-block">
            <button
              onClick={() => setShowConfirm(true)}
              className="
                group
                flex
                items-center
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-medium
                px-3
                py-2
                rounded-full
                transition-all duration-200
                group-hover:px-4
                overflow-hidden
              "
            >
              <span className="whitespace-nowrap transition-all duration-200">
                {firstName} {lastName.charAt(0)}.
              </span>
              <span className="opacity-0 group-hover:opacity-100 ml-2 transition-opacity duration-200">
                ×
              </span>
            </button>

            {showConfirm && (
              <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="mb-4 text-lg">Izpis?</p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="
                        px-4
                        py-2
                        border
                        rounded-md
                        hover:bg-gray-100
                      "
                    >
                      Ne
                    </button>
                    <button
                      onClick={handleConfirmLogout}
                      className="
                        px-4
                        py-2
                        bg-red-600
                        text-white
                        rounded-md
                        hover:bg-red-700
                      "
                    >
                      Da
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => showAuthSetter("login")}
            className="
              inline-block
              bg-red-600
              hover:bg-red-700
              text-white
              font-medium
              px-4
              py-2
              rounded-full
              transition-colors
            "
          >
            Prijava
          </button>
        )}
      </div>
    </header>
  );
}

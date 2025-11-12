// src/context/AuthContext.tsx
"use client";

import { createContext, useContext } from "react";

type AuthMode = "login" | "register";

export interface AuthContextType {
  openAuth: (mode: AuthMode, onSuccess?: () => void) => void;
  notifyLogin?: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  openAuth: () => {
    throw new Error("AuthContext not initialized");
  },
  notifyLogin: () => {},
});

export function useAuthModal() {
  return useContext(AuthContext);
}

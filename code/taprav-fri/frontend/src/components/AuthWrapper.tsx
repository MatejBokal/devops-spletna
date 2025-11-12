// src/app/components/AuthWrapper.tsx
'use client';

import { useState, useCallback } from 'react';
import Auth from '@/components/Auth';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { AuthContext } from '@/context/AuthContext';

type AuthMode = 'login' | 'register';

interface AuthWrapperProps {
  incrementLogin: () => void;
  loginCounter: number;
  onLogout: () => Promise<void>;
  children: React.ReactNode;
}

export default function AuthWrapper({
  incrementLogin,
  loginCounter,
  onLogout,
  children,
}: AuthWrapperProps) {
  const [showAuth, setShowAuth] = useState<AuthMode | null>(null);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | undefined>(undefined);

  const openAuth = useCallback((mode: AuthMode, onSuccess?: () => void) => {
    setShowAuth(mode);
    setOnSuccessCallback(() => onSuccess);
  }, []);

  const handleClose = useCallback(() => {
    setShowAuth(null);
    setOnSuccessCallback(undefined);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        openAuth,
        notifyLogin: incrementLogin,
      }}
    >
      {showAuth !== null && (
        <div key={`modal-${showAuth}`}>
          <Auth
            key={`auth-${showAuth}`}
            mode={showAuth}
            onClose={handleClose}
            onSuccess={() => {
              handleClose();
              incrementLogin();
              if (onSuccessCallback) onSuccessCallback();
            }}
          />
        </div>
      )}

      <Header showAuthSetter={setShowAuth} loginCounter={loginCounter} onLogout={onLogout} />
      <Navigation
        onLoginClick={() => openAuth('login')}
        onLogoutClick={() => {
            void onLogout();
          }}
        loginCounter={loginCounter}
      />

      {children}
    </AuthContext.Provider>
  );
}

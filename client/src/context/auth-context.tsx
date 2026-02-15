import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userType: "artisan" | "customer" | null;
  userName: string | null;
  login: (type: "artisan" | "customer", name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"artisan" | "customer" | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const login = (type: "artisan" | "customer", name: string) => {
    setIsLoggedIn(true);
    setUserType(type);
    setUserName(name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

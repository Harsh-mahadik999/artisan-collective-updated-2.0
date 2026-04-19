import { createContext, useContext, useState } from "react";

type UserType = "artisan" | "customer";

interface AuthContextType {
  isLoggedIn: boolean;
  userType:   UserType | null;
  userName:   string | null;
  login:      (type: UserType, name: string) => void;
  logout:     () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("auth_logged_in") === "true";
  });
  const [userType, setUserType] = useState<UserType | null>(() => {
    return (localStorage.getItem("auth_user_type") as UserType) || null;
  });
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem("auth_user_name") || null;
  });

  const login = (type: UserType, name: string) => {
    setIsLoggedIn(true);
    setUserType(type);
    setUserName(name);
    localStorage.setItem("auth_logged_in", "true");
    localStorage.setItem("auth_user_type", type);
    localStorage.setItem("auth_user_name", name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserName(null);
    localStorage.removeItem("auth_logged_in");
    localStorage.removeItem("auth_user_type");
    localStorage.removeItem("auth_user_name");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

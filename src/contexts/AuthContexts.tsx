import React, { createContext, useState, useEffect } from "react";

// 🔹 Define a User interface
interface User {
  id: number;
  name: string;
  email: string;
  role: "doctor" | "customer" | "admin"; // adjust as needed
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  login: (token: string, refresh:string, userData?: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (token) {
    setIsAuthenticated(true);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }

  setLoading(false);

  // ✅ Listen for "sessionExpired" events from axios
  const handleSessionExpired = () => {
    logout();
    window.location.href = "/login"; // Redirect automatically
  };

  window.addEventListener("sessionExpired", handleSessionExpired);

  return () => {
    window.removeEventListener("sessionExpired", handleSessionExpired);
  };
}, []);


  const login = (access: string, refresh:string, userData?: User) => {
    console.log('bbbbbb', access)
    localStorage.setItem("token", access);
    localStorage.setItem("refresh", refresh);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log("jhshsh")
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    console.log("kkkk",localStorage.getItem("user"))
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

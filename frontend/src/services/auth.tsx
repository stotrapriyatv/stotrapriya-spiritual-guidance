import { createContext, useContext, useState, ReactNode } from "react";

const STORAGE_KEY = "stotrapriya-admin-token";
const NAME_KEY = "stotrapriya-admin-name";

interface AuthContextValue {
  token: string | null;
  adminName: string | null;
  login: (token: string, adminName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => window.sessionStorage.getItem(STORAGE_KEY));
  const [adminName, setAdminName] = useState<string | null>(() => window.sessionStorage.getItem(NAME_KEY));

  const login = (newToken: string, name: string) => {
    setToken(newToken);
    setAdminName(name);
    window.sessionStorage.setItem(STORAGE_KEY, newToken);
    window.sessionStorage.setItem(NAME_KEY, name);
  };

  const logout = () => {
    setToken(null);
    setAdminName(null);
    window.sessionStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(NAME_KEY);
  };

  return <AuthContext.Provider value={{ token, adminName, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

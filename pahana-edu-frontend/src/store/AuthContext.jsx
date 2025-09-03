// src/store/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/axios"; // <-- named import

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; } catch { return null; }
  });
  const isAuthenticated = !!user;
  const role = user?.role;

  useEffect(() => {
    const already = localStorage.getItem("user");
    if (already) return;
    api.get("/api/v1/auth/me").then(({ data }) => {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("app:unauthorized", handler);
    return () => window.removeEventListener("app:unauthorized", handler);
  }, []);

  async function login(username, password) {
    const response = await api.post("/api/v1/auth/login", { username, password });
    console.log('Login response headers:', response.headers);
    console.log('Login successful - storing credentials for basic auth');
    console.log('Cookies after login:', document.cookie);
    
    // Store user data and credentials for basic auth
    setUser(response.data);
    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("userCredentials", JSON.stringify({ username, password }));
    return response.data;
  }

  async function register(payload) {
    const { data } = await api.post("/api/v1/auth/register", payload);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  }

  async function logout() {
    try { await api.post("/api/v1/auth/logout"); } catch {}
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userCredentials");
  }

  const value = useMemo(() => ({ user, role, isAuthenticated, login, register, logout }), [user, role, isAuthenticated]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

// Provide a default export so this works: `import AuthProvider from "./store/AuthContext"`
export default AuthProvider;


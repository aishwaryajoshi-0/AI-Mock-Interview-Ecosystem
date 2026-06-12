import { createContext, useContext, useEffect, useMemo } from "react";
import { useAuthStore } from "../store/authSlice";
import * as authService from "../services/authService";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, token, setAuthState, clearAuth } = useAuthStore();

  useEffect(() => {
    const savedToken = localStorage.getItem("mockInterviewToken");
    const savedUser = JSON.parse(localStorage.getItem("mockInterviewUser") || "null");
    if (savedToken && savedUser) {
      setAuthState(savedUser, savedToken);
    }
  }, [setAuthState]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    const sessionToken = data.token;
    localStorage.setItem("mockInterviewToken", sessionToken);
    localStorage.setItem("mockInterviewUser", JSON.stringify(data.user));
    setAuthState(data.user, sessionToken);
    toast.success("Welcome back!");
  };

  const register = async (values) => {
    const data = await authService.register(values);
    const sessionToken = data.token;
    localStorage.setItem("mockInterviewToken", sessionToken);
    localStorage.setItem("mockInterviewUser", JSON.stringify(data.user));
    setAuthState(data.user, sessionToken);
    toast.success("Account created successfully");
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearAuth();
      toast.success("Logged out successfully");
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      register,
      isAuthenticated: Boolean(user && token),
    }),
    [user, token]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

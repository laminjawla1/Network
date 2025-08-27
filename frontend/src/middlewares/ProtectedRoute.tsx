import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useEffect, useState, type FC, type ReactNode } from "react";
import type { JwtPayload } from "../types/jwt";

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    auth().catch(() => setIsAuthenticated(false));
  }, []);

  const refreshToken = async () => {
    const rToken = localStorage.getItem(REFRESH_TOKEN);

    try {
      const response = await api.post("/users/token/refresh/", {
        refresh: rToken,
      });
      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    const decoded = jwtDecode<JwtPayload>(token);
    const tokenExpiry = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiry < now) {
      await refreshToken();
    } else {
      setIsAuthenticated(true);
    }
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/users/login" replace={true} />
  );
};

export default ProtectedRoute;

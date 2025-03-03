import React, { createContext, useContext, useState, useEffect } from "react";
import { tokenCache } from "../utils/auth";
import { useRouter } from "expo-router";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children } : any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [isAppReady, setIsAppReady] = useState(false); 

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await tokenCache.getToken("auth-token");
        if (token) {
          setIsAuthenticated(true);
          const fetchedUser = await fetchUserData(token);
          setUser(fetchedUser);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
      } finally {
        setIsLoading(false);
        setIsAppReady(true); 
      }
    };

    checkAuthentication();
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const baseURL = process.env.EXPO_PUBLIC_BASE_URL;
      console.log("Fetching user data from:", `${baseURL}/users/me`);

      const response = await fetch(`${baseURL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        if (!data.first_name || !data.email) {
          console.error("Incomplete user data:", data);
          throw new Error("Incomplete user data.");
        }
        return data;
      } else {
        console.error("Failed to fetch user data", response.status);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const login = async (token: string) => {
    await tokenCache.saveToken("auth-token", token);
    setIsAuthenticated(true);
    const fetchedUser = await fetchUserData(token);
    setUser(fetchedUser);

    if (isAppReady) {
      router.replace("/(root)/(tabs)/home");
    }
  };

  const logout = async () => {
    await tokenCache.deleteToken("auth-token");
    setIsAuthenticated(false);
    setUser(null);

    if (isAppReady) {
      router.replace("/(auth)/sign-in");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
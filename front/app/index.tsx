import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View, Text } from "react-native";
import '@/assets/style/fonts.css';

const Page: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("index.tsx rendered 🚀", { isLoading, isAuthenticated });
  
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/(root)/(tabs)/home");
      } else {
        router.replace("/(auth)/sign-in");
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null;
};

export default Page;
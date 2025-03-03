import React from "react";
import { View, Text, ScrollView, ActivityIndicator, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Layout/Header";
import FeatureButton from "@/components/FeatureButton";
import ArticleCard from "@/components/ArticleCard";
import { images } from "@/constants/index";
import { useAuth } from "@/context/AuthContext";

const Home: React.FC = () => {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500 text-lg mb-4">
          Unable to load user data. Please log in again.
        </Text>
        <Button title="Log Out" onPress={logout} />
      </View>
    );
  }
  
  const features = [
    { title: "Pet Sitters", icon: images.sitters, route: "/(pages)/petsitters", color: "#674CFF" },
    { title: "Map", icon: images.map, route: "/(pages)/map", color: "#8A75FF" },
    // { title: "Special Offer", icon: images.special, route: "/(pages)/specialoffer", color: "#8A75FF" },
    // { title: "Pet Store", icon: images.petstore, route: "/(tabs)/shop", color: "#674CFF" },
  ];

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="sticky top-0 z-10">
        <Header />
      </View>

      <Text className="text-2xl mb-2 font-PoppinsRegular">
        Welcome {user.first_name || "User"}!
      </Text>
      <Text className="text-gray-500 mb-6">
        Everything your pet needs, all in one place.
      </Text>

      <View className="flex-row flex-wrap justify-between mb-6">
        {features.map((feature, index) => (
          <FeatureButton
            key={index}
            title={feature.title}
            icon={feature.icon}
            onPress={() => router.push(feature.route as any)}
            color={feature.color}
          />
        ))}
      </View>

      <Text className="text-xl font-bold mb-4">Articles</Text>
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <ArticleCard
            key={index}
            title="Your cat trying to kill you?"
            author="David Smith"
            date="24/12/2024"
            imageUrl={images.cat}
          />
        ))}
    </ScrollView>
  );
};

export default Home;

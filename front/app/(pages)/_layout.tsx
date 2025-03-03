import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="map" options={{ headerShown: false }} />
      <Stack.Screen name="specialoffer" options={{ headerShown: false }} />
      <Stack.Screen name="petsitters" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;

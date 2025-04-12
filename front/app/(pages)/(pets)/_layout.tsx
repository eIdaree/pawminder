import { Stack } from 'expo-router';

export default function Layout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name='todo' options={{ headerShown: false }} />
			<Stack.Screen name='addpet' options={{ headerShown: false }} />
			<Stack.Screen name='PetProfile' options={{ headerShown: false }} />
		</Stack>
	);
}

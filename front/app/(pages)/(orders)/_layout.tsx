import { BackButton } from '@/components/shared/BackButton';
import { Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';

export default function Layout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name='orderForm' options={{ headerShown: false }} />
			<Stack.Screen name='orderCard' options={{ headerShown: false }} />
			<Stack.Screen
				name='orderList'
				options={{
					headerShown: false
				}}
			/>
		</Stack>
	);
}

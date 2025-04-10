import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name='sitterCatalog' options={{ headerShown: false }} />
			<Stack.Screen
				name='formApplication'
				options={{
					headerShown: false,
					headerTransparent: true,
					headerBlurEffect: 'regular'
				}}
			/>
			<Stack.Screen
				name='sitterProfile'
				options={{
					title: '',
					headerShown: false,
					headerTitleAlign: 'center',

					headerLeft: () => (
						<Pressable onPress={() => router.back()} className='ml-1'>
							<Ionicons name='arrow-back' size={24} />
						</Pressable>
					)
				}}
			/>
		</Stack>
	);
}

import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PetsProvider } from '@/context/PetContext';
import { BalanceProvider } from '@/context/BalanceContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		'Poppins-SemiBold': require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
		'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
		'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
		'Poppins-Medium': require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
		'Inter-Regular': require('../assets/fonts/Inter/static/Inter-Regular.ttf'),
		'Inter-SemiBold': require('../assets/fonts/Inter/static/Inter-SemiBold.ttf'),
		'Inter-Bold': require('../assets/fonts/Inter/static/Inter-Bold.ttf'),
		'Inter-Medium': require('../assets/fonts/Inter/static/Inter-Medium.ttf')
	});

	const [isAppReady, setIsAppReady] = useState(false);

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync();
			setIsAppReady(true);
		}
	}, [fontsLoaded]);

	if (!fontsLoaded || !isAppReady) {
		return null;
	}

	return (
		<AuthProvider>
			<PetsProvider>
				<BalanceProvider>
					<Stack
						screenOptions={{
							headerStyle: { backgroundColor: '#06b6d4' },
							headerTintColor: '#fff',
							headerTitleAlign: 'center',
							headerShown: false
						}}
					/>
				</BalanceProvider>
			</PetsProvider>
		</AuthProvider>
	);
}

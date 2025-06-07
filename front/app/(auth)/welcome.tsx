import { Button } from '@/components/shared/Button';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

export default function Welcome() {
	const router = useRouter();

	const handleSelect = (role: 'user' | 'sitter') => {
		router.push({ pathname: '/(auth)/sign-up', params: { role } });
	};

	return (
		<View className='flex-1 justify-center items-center bg-white'>
			<Text className='text-2xl font-bold mb-6'>Hello, you are...?</Text>
			<View className='flex-column'>
				<Button
					title='🐾 I am a Pet Sitter'
					onPress={() => handleSelect('sitter')}
					classes='mb-4'
					size='xl'
					variant='default'
				/>
				<Button
					title='👤 I am a Pet Owner'
					onPress={() => handleSelect('user')}
					size='xl'
					variant='primary'
				/>
			</View>
			<Text className='text-center text-gray-500 mt-4'>
				Already have an account?{' '}
				<Text
					className='text-primary font-bold'
					onPress={() => router.push('/sign-in')}
				>
					Sign In
				</Text>
			</Text>
		</View>
	);
}

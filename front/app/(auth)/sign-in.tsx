import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const SignIn: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const { login } = useAuth();
	const router = useRouter();

	const handleSignIn = async () => {
		try {
			const baseURL = process.env.EXPO_PUBLIC_BASE_URL;
			console.log(baseURL);
			const response = await fetch(`${baseURL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password
				})
			});

			if (!response.ok) {
				throw new Error('Failed to sign in');
			}

			const data = await response.json();
			await login(data.token);
		} catch (error: any) {
			setError(error.message);
		}
	};

	return (
		<View className='flex-1 justify-center px-5 py-5 bg-gray-100'>
			<View className='mb-10'>
				<Text className='text-4xl font-bold w-[80%] font-PoppinsSemiBold'>
					Sign in to your Account
				</Text>
				<Text className='text-gray-400'>
					Enter your email and password to log in{' '}
				</Text>
			</View>
			<TextInput
				className='h-12 border border-gray-300 rounded-lg mb-3 px-3'
				placeholder='Email'
				value={email}
				onChangeText={setEmail}
			/>
			<TextInput
				className='h-12 border border-gray-300 rounded-lg mb-3 px-3'
				placeholder='Password'
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			{error && <Text className='text-red-500 mb-3 text-center'>{error}</Text>}
			<TouchableOpacity
				className='bg-primary py-3 rounded-lg mb-4'
				onPress={handleSignIn}
			>
				<Text className='text-white text-center font-bold text-lg'>
					Sign In
				</Text>
			</TouchableOpacity>

			<View className='mt-5 flex-row justify-center'>
				<Text className='text-gray-700'>Don’t have an account? </Text>
				<TouchableOpacity onPress={() => router.push('/sign-up')}>
					<Text className='text-primary underline font-bold'>Sign Up</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default SignIn;

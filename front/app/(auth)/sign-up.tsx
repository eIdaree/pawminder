import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

import DateTimePicker from '@react-native-community/datetimepicker';

const SignUp: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [dob, setDob] = useState<Date | undefined>(undefined);
	const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const { login } = useAuth();
	const router = useRouter();
	const { role } = useLocalSearchParams();
	console.log(role);
	const handleSignUp = async () => {
		if (
			!email ||
			!password ||
			!firstName ||
			!lastName ||
			!phoneNumber ||
			!dob
		) {
			setError('Please fill all fields.');
			return;
		}

		try {
			setLoading(true);
			setError(null);
			const baseURL = process.env.EXPO_PUBLIC_BASE_URL;
			const response = await fetch(`${baseURL}/users/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password,
					first_name: firstName,
					last_name: lastName,
					phone: phoneNumber,
					date_of_birth: dob.toISOString(),
					isActivated: true,
					role: role
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				setError(errorData.message || 'Failed to sign up.');
				return;
			}

			const data = await response.json();

			if (data.token) {
				await login(data.token);
				router.replace('/(auth)/sign-in');
			} else {
				setError('Sign-up succeeded, but no token received.');
			}
		} catch (error: any) {
			setError(error.message || 'Failed to sign up.');
		} finally {
			setLoading(false);
		}
	};

	const handleDateChange = (event: any, selectedDate?: Date) => {
		const currentDate = selectedDate || dob;
		setDob(currentDate);
		setIsDatePickerVisible(false); // Hide the picker after selection
	};

	const toggleDatePicker = () => {
		setIsDatePickerVisible(!isDatePickerVisible);
	};

	return (
		<View className='flex-1 justify-center px-5 py-5 bg-gray-100'>
			<View>
				<Text className='text-4xl font-bold text-left mb-2'>Register</Text>
				<Text className=' text-gray-400 text-left mb-5'>
					Create an account to continue!
				</Text>
			</View>
			<TextInput
				className='h-12 border border-gray-300 rounded-lg mb-3 px-3'
				placeholder='First Name'
				value={firstName}
				onChangeText={setFirstName}
			/>
			<TextInput
				className='h-12 border border-gray-300 rounded-lg mb-3 px-3'
				placeholder='Last Name'
				value={lastName}
				onChangeText={setLastName}
			/>
			<TextInput
				className='h-12 border border-gray-300 rounded-lg mb-3 px-3'
				placeholder='Email'
				value={email}
				onChangeText={setEmail}
				keyboardType='email-address'
			/>
			<TextInput
				className='h-12 border border-gray-300 rounded-lg mb-3 px-3'
				placeholder='Phone Number'
				value={phoneNumber}
				onChangeText={setPhoneNumber}
				keyboardType='phone-pad'
			/>

			<View className='mb-3'>
				<TouchableOpacity
					onPress={toggleDatePicker}
					className='h-12 border border-gray-300 rounded-lg px-3 flex justify-center bg-white'
				>
					<Text className='text-gray-600'>
						{dob ? dob.toLocaleDateString() : 'Select Date'}
					</Text>
				</TouchableOpacity>
				{isDatePickerVisible && (
					<DateTimePicker
						value={dob || new Date()}
						mode='date'
						display='default'
						onChange={handleDateChange}
					/>
				)}
			</View>

			<TextInput
				className='h-12 border border-gray-300 rounded-lg mb-3 px-3'
				placeholder='Password'
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>

			{error && <Text className='text-red-500 mb-3 text-center'>{error}</Text>}

			<TouchableOpacity
				onPress={handleSignUp}
				className='bg-primary py-3 rounded-lg mb-4'
			>
				<Text className='text-white text-center font-bold text-lg'>
					{loading ? 'Registering...' : 'Register'}
				</Text>
			</TouchableOpacity>

			<Text className='text-center text-gray-600'>
				Already have an account?{' '}
				<Text
					className='text-primary font-bold'
					onPress={() => router.push('/(auth)/sign-in')}
				>
					Log in
				</Text>
			</Text>
		</View>
	);
};

export default SignUp;

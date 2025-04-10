import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native'; // Используем TouchableOpacity
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Button } from '@/components/shared/Button';
import { images } from '@/constants';

const getVerificationMessage = (status: string) => {
	switch (status) {
		case 'unverified':
			return 'Вы ещё не проходили верификацию.\nЧтобы продолжить, пожалуйста, заполните форму и подтвердите свою квалификацию.';
		case 'pending':
			return 'Заявка на верификацию отправлена. Ожидайте подтверждения.';
		case 'verified':
			return 'Вы верифицированный специалист ✅';
		case 'rejected':
			return 'Ваша заявка отклонена. Пожалуйста, обновите данные и попробуйте снова.';
		default:
			return 'Статус неизвестен';
	}
};
const getStatusColor = (status: string) => {
	switch (status) {
		case 'verified':
			return 'text-green-600';
		case 'pending':
			return 'text-yellow-600';
		case 'rejected':
			return 'text-red-600';
		case 'unverified':
			return 'text-red-600';
		default:
			return 'text-gray-600';
	}
};

const Profile = () => {
	const { user, logout } = useAuth();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			logout();
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	return (
		<View className='bg-gray-100 px-4 py-8 items-start flex-column'>
			{/* Картинка животного */}
			<Text className='text-3xl font-PoppinsSemiBold text-bold'>
				Welcome {user.first_name}
			</Text>
			<View>
				<Text className={` text-xs ${getStatusColor(user.verificationStatus)}`}>
					{getVerificationMessage(user.verificationStatus)}
				</Text>
			</View>
			<Pressable onPress={() => router.push('/formApplication')}>
				<Image
					source={images.formapplication}
					className='w-[328px] h-[120px] mt-4'
				/>
			</Pressable>

			{/* Текст */}
			<View className='mt-4'>
				<Text className='text-lg font-bold text-left'>Email</Text>
				<Text className='text-sm  mb-4 text-left'>{user.email}</Text>
				<Text className='text-lg font-bold text-left'>Phone Number</Text>
				<Text className='text-sm '>{user.phone}</Text>
			</View>

			{/* Кнопка выхода с кастомным стилем */}
			<TouchableOpacity
				className='mt-8 bg-red-500 h-12 px-4 py-2 rounded-lg w-full '
				onPress={handleLogout}
			>
				<Text className='text-center text-white text-lg text-bold font-PoppinsSemiBold'>
					Logout
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Profile;

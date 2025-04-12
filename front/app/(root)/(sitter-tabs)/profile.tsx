import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useBalance } from '@/context/BalanceContext';
import { images } from '@/constants';

const getVerificationMessage = (status: string) => {
	switch (status) {
		case 'unverified':
			return 'Вы ещё не проходили верификацию.\nПожалуйста, заполните форму.';
		case 'pending':
			return 'Заявка отправлена. Ожидайте подтверждения.';
		case 'verified':
			return 'Вы верифицированный специалист ✅';
		case 'rejected':
			return 'Заявка отклонена. Попробуйте снова.';
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
		case 'unverified':
			return 'text-red-600';
		default:
			return 'text-gray-600';
	}
};

const Profile = () => {
	const { user, logout } = useAuth();
	const router = useRouter();
	const { balance } = useBalance();

	const handleLogout = async () => {
		try {
			logout();
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	return (
		<View className='bg-gray-100 px-4 py-8 items-start flex-1'>
			{/* Header */}
			<Text className='text-3xl font-PoppinsSemiBold'>
				Welcome {user.first_name}
			</Text>
			<Text
				className={`mt-2 text-xs ${getStatusColor(user.verificationStatus)}`}
			>
				{getVerificationMessage(user.verificationStatus)}
			</Text>

			{/* Balance (read-only) */}
			<View className='my-5 bg-white w-full rounded-xl px-4 py-4 shadow'>
				<Text className='text-lg font-PoppinsSemiBold text-gray-700 mb-1'>
					Current Balance
				</Text>
				<Text className='text-2xl font-PoppinsSemiBold text-green-600'>
					₸ {balance}
				</Text>
			</View>

			{/* Verification Form */}
			<Pressable onPress={() => router.push('/formApplication')}>
				<Image
					source={images.formapplication}
					className='w-[328px] h-[120px] mb-4'
				/>
			</Pressable>

			{/* Info */}
			<View className='w-full'>
				<Text className='text-lg font-bold'>Email</Text>
				<Text className='text-sm mb-4'>{user.email}</Text>
				<Text className='text-lg font-bold'>Phone</Text>
				<Text className='text-sm mb-4'>{user.phone}</Text>

				<Pressable
					onPress={() => router.push('/(pages)/(balance)/transactions')}
				>
					<Text className='text-lg font-PoppinsSemiBold mt-2'>
						View Transactions
					</Text>
				</Pressable>
			</View>

			{/* Logout */}
			<TouchableOpacity
				className='mt-auto bg-red-500 h-12 px-4 py-2 rounded-lg w-full mb-4'
				onPress={handleLogout}
			>
				<Text className='text-center text-white text-lg font-PoppinsSemiBold'>
					Logout
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Profile;

import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import TopUpModal from '@/components/TopUpModal';
import { useBalance } from '@/context/BalanceContext';

const Profile = () => {
	const { user, logout } = useAuth();
	const router = useRouter();
	const { balance } = useBalance();
	const [showModal, setShowModal] = useState(false);

	const handleLogout = async () => {
		try {
			logout();
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	return (
		<View className='bg-gray-100 px-4 py-8 items-start flex-1'>
			<Text className='text-3xl font-PoppinsSemiBold text-bold'>
				Welcome {user.first_name}
			</Text>
			<Text className='text-xl font-PoppinsSemiBold mb-6'>
				How are you doing?
			</Text>

			<View className='mb-4 bg-white w-full rounded-xl px-4 py-4 shadow'>
				<Text className='text-lg font-PoppinsSemiBold text-gray-700 mb-1'>
					Your Balance
				</Text>
				<Text className='text-2xl font-PoppinsSemiBold text-green-600 mb-3'>
					₸ {balance}
				</Text>
				<TouchableOpacity
					className='bg-primary py-2 px-4 rounded-xl'
					onPress={() => setShowModal(true)}
				>
					<Text className='text-white font-PoppinsSemiBold text-center'>
						Top Up
					</Text>
				</TouchableOpacity>
			</View>

			<View className='w-full'>
				<Text className='text-lg font-PoppinsSemiBold text-left'>Email</Text>
				<Text className='text-sm mb-4 font-PoppinsRegular'>{user.email}</Text>
				<Text className='text-lg font-PoppinsSemiBold'>Phone Number</Text>
				<Text className='text-sm mb-4'>{user.phone}</Text>

				<Pressable onPress={() => router.push('/(pages)/(orders)/orderList')}>
					<Text className='text-lg font-PoppinsSemiBold mt-2'>My orders</Text>
				</Pressable>

				<Pressable
					onPress={() => router.push('/(pages)/(balance)/transactions')}
				>
					<Text className='text-lg font-PoppinsSemiBold mt-2'>
						View Transactions
					</Text>
				</Pressable>
			</View>

			<TouchableOpacity
				className='mt-auto bg-red-500 h-12 px-4 py-2 rounded-lg w-full mb-4'
				onPress={handleLogout}
			>
				<Text className='text-center text-white text-lg font-PoppinsSemiBold'>
					Logout
				</Text>
			</TouchableOpacity>

			<TopUpModal visible={showModal} onClose={() => setShowModal(false)} />
		</View>
	);
};

export default Profile;

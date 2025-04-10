// components/OrderList.tsx
import React, { useCallback } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator
} from 'react-native';
import { useOrders } from '@/hooks/useOrders';
import { useFocusEffect, useRouter } from 'expo-router';
import { Order } from '@/types/types';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

const getStatusBadgeStyle = (status: string) => {
	switch (status) {
		case 'pending':
			return { text: 'Ожидает подтверждения', bg: 'bg-lightgray' };
		case 'accepted':
			return { text: 'Подтверждён', bg: 'bg-blue-100' };
		case 'in_progress':
			return { text: 'В процессе', bg: 'bg-indigo-100' };
		case 'completed':
			return { text: 'Завершён', bg: 'bg-green-100' };
		case 'rejected':
			return { text: 'Отменён', bg: 'bg-red-100' };
		default:
			return { text: 'Неизвестно', bg: 'bg-gray-200' };
	}
};

const OrderList = () => {
	const { user } = useAuth();
	const isSitter = user.role === 'sitter';
	const { orders, loading, error, refetch } = useOrders(
		isSitter ? 'sitter' : 'owner'
	);
	const router = useRouter();

	useFocusEffect(
		useCallback(() => {
			refetch();
		}, [])
	);

	if (loading) return <ActivityIndicator size='large' />;
	if (error) return <Text>Ошибка загрузки заказов</Text>;
	const headerStyle = 'text-sm text-gray-600 font-PoppinsSemiBold';
	const filteredOrders = orders.filter((order: Order) => {
		if (isSitter) {
			return ['pending', 'accepted'].includes(order.status);
		} else {
			return !(order.status === 'completed' && order.rating); // скрыть завершённые с отзывом
		}
	});
	return (
		<>
			{!isSitter && (
				<View className='flex-row items-center justify-between px-4 py-5'>
					<TouchableOpacity
						onPress={() => router.back()}
						className='p-2 rounded-full bg-white/80'
					>
						<Feather name='arrow-left' size={24} color='black' />
					</TouchableOpacity>

					<Text className='font-PoppinsSemiBold text-xl'>My Orders</Text>

					<View className='w-[40px]' />
				</View>
			)}

			<ScrollView className='mt-4 mb-10'>
				{filteredOrders.length === 0 ? (
					<View className='flex-1 justify-center items-center m-auto'>
						<Text className='text-center  font-PoppinsSemiBold text-2xl'>
							You have no order
						</Text>
					</View>
				) : (
					filteredOrders.map((order: Order) => {
						const { text, bg } = getStatusBadgeStyle(order.status);

						return (
							<TouchableOpacity
								key={order.id}
								className='mb-4 p-4 mx-5 bg-white rounded-2xl shadow'
								onPress={() =>
									router.push({
										pathname: '/(pages)/(orders)/orderCard',
										params: { order: JSON.stringify(order) }
									})
								}
							>
								<Text className='text-xl text-text font-semibold mb-3'>
									Order #{order.id}
								</Text>
								<Text className='text-base text-darkgray mb-3'>
									Pet: {order.pet?.species || '—'}
								</Text>
								<Text className='text-base text-darkgray mb-3'>
									Service: {order.services.join(', ')}
								</Text>
								<Text className='text-base text-text font-PoppinsSemiBold mb-1'>
									Status:
								</Text>
								<View
									className={`self-start py-1.5 px-6 mt-2 rounded-full ${bg}`}
								>
									<Text className='text-sm text-text font-PoppinsSemiBold'>
										{text}
									</Text>
								</View>
							</TouchableOpacity>
						);
					})
				)}
			</ScrollView>
		</>
	);
};

export default OrderList;

import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Alert,
	ScrollView,
	TextInput
} from 'react-native';
import { Order } from '@/types/types';
import { useAuth } from '@/context/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import { BackButton } from '@/components/shared/BackButton';
import SitterCard from '@/components/SitterCard';
import { useOrders } from '@/hooks/useOrders';

const InfoBlock = ({ label }: { label: string }) => (
	<Text className='font-PoppinsMedium text-sm mt-2 bg-white px-[14px] py-5 rounded-2xl'>
		{label}
	</Text>
);

const OrderCard = () => {
	const { user } = useAuth();
	const { updateOrderStatus } = useOrders();
	const params = useLocalSearchParams();
	const initialOrder: Order = JSON.parse(params.order as string);
	const [localOrder, setLocalOrder] = useState(initialOrder);

	const [rating, setRating] = useState('');
	const [review, setReview] = useState('');

	const { sitter, user: owner, pet, status } = localOrder;

	const isSitter = user.id === sitter?.id;
	const isOwner = user.id === owner?.id;

	const completeOrder = async () => {
		try {
			await updateOrderStatus(localOrder.id, { status: 'completed' });
			setLocalOrder({ ...localOrder, status: 'completed' });
			Alert.alert('Успех', 'Заказ завершён');
		} catch {
			Alert.alert('Ошибка', 'Не удалось завершить заказ');
		}
	};

	const submitReview = async () => {
		if (!rating) return Alert.alert('Ошибка', 'Пожалуйста, укажите рейтинг');
		try {
			await updateOrderStatus(localOrder.id, {
				rating: Number(rating),
				review
			});
			setLocalOrder({ ...localOrder, rating: Number(rating), review });
			Alert.alert('Спасибо!', 'Отзыв сохранён');
		} catch {
			Alert.alert('Ошибка', 'Не удалось отправить отзыв');
		}
	};

	return (
		<>
			<BackButton />
			<ScrollView
				className='bg-background rounded-xl p-6'
				contentContainerStyle={{ paddingBottom: 60 }}
			>
				<Text className='mt-14 text-text font-PoppinsSemiBold text-[32px]'>
					Order Information
				</Text>
				<Text className='mt-3 font-PoppinsRegular text-base text-darkgray'>
					Information about your client.
				</Text>

				{/* Owner */}
				<Text className='mt-4 font-PoppinsSemiBold text-base text-text'>
					Owner info
				</Text>
				<InfoBlock label={`${owner?.first_name} ${owner?.last_name}`} />
				<InfoBlock label={owner?.phone || '—'} />

				{/* Sitter */}
				<Text className='mt-4 font-PoppinsSemiBold text-base text-text'>
					Sitter info
				</Text>
				<InfoBlock label={`${sitter?.first_name} ${sitter?.last_name}`} />
				<InfoBlock label={sitter?.phone || '—'} />

				{/* Pet */}
				<Text className='mt-4 font-PoppinsSemiBold text-base text-text'>
					Pet info
				</Text>
				<InfoBlock label={pet.name} />
				<InfoBlock label={pet.species} />

				{/* Date, time, fee */}
				<Text className='mt-4 font-PoppinsSemiBold text-base text-text'>
					Dates, times, and fees
				</Text>
				<InfoBlock
					label={`Start ${new Date(
						localOrder.startDate
					).toLocaleDateString()} due to ${new Date(
						localOrder.endDate
					).toLocaleDateString()}`}
				/>
				<InfoBlock label={localOrder.careTime} />
				<InfoBlock label={`${localOrder.fee} tenge`} />

				{/* Services */}
				<Text className='mt-4 font-PoppinsSemiBold text-base text-text'>
					Necessary services
				</Text>
				<InfoBlock label={localOrder.services.join(', ')} />

				<Text className='text-darkgray mt-2 font-PoppinsRegular text-base'>
					Our service charges a 10% commission on the order amount. This fee is
					automatically deducted upon transaction.
				</Text>

				{localOrder.platformCommission && (
					<Text className='text-sm text-gray-500 mt-1'>
						Platform commission: {localOrder.platformCommission} ₸
					</Text>
				)}

				{/* Actions */}
				{isSitter && localOrder.status === 'pending' && (
					<View className='flex-column gap-3 mt-4'>
						<TouchableOpacity
							className='bg-green-500 px-6 py-3.5 rounded-xl'
							onPress={() =>
								updateOrderStatus(localOrder.id, { status: 'accepted' })
							}
						>
							<Text className='text-white text-center font-PoppinsSemiBold text-base'>
								Accept Order
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className='bg-red-500 px-6 py-3.5 rounded-xl'
							onPress={() =>
								updateOrderStatus(localOrder.id, { status: 'rejected' })
							}
						>
							<Text className='text-white text-center font-PoppinsSemiBold text-base'>
								Decline Order
							</Text>
						</TouchableOpacity>
					</View>
				)}

				{isOwner && localOrder.status === 'accepted' && (
					<TouchableOpacity
						className='bg-primary px-6 py-3.5 rounded-xl mt-4'
						onPress={completeOrder}
					>
						<Text className='text-white text-center font-PoppinsSemiBold text-base'>
							Complete order
						</Text>
					</TouchableOpacity>
				)}

				{isOwner && localOrder.status === 'completed' && !localOrder.rating && (
					<View className='mt-6'>
						<Text className='font-PoppinsSemiBold text-base mb-2'>
							Оставить отзыв:
						</Text>
						<TextInput
							placeholder='Рейтинг от 1 до 5'
							keyboardType='numeric'
							value={rating}
							onChangeText={setRating}
							className='bg-white p-3 rounded-xl mb-2'
						/>
						<TextInput
							placeholder='Ваш отзыв'
							value={review}
							onChangeText={setReview}
							multiline
							className='bg-white p-3 rounded-xl h-28'
						/>
						<TouchableOpacity
							className='bg-primary py-3 mt-4 rounded-xl'
							onPress={submitReview}
						>
							<Text className='text-center text-white font-PoppinsSemiBold'>
								Отправить отзыв
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</ScrollView>
		</>
	);
};

export default OrderCard;

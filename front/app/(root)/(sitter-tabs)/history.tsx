import React, { useCallback, useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator
} from 'react-native';
import { useOrders } from '@/hooks/useOrders';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateTime, timeAgo } from '@/helper/date';

const HistoryList = () => {
	const { user } = useAuth();
	const isSitter = user.role === 'sitter';
	const { orders, loading, error, refetch } = useOrders(
		isSitter ? 'sitter' : 'owner'
	);
	const router = useRouter();

	const [fromDate, setFromDate] = useState<Date | null>(null);
	const [toDate, setToDate] = useState<Date | null>(null);
	const [showFromPicker, setShowFromPicker] = useState(false);
	const [showToPicker, setShowToPicker] = useState(false);
	const [sortNewestFirst, setSortNewestFirst] = useState(true);

	useFocusEffect(
		useCallback(() => {
			refetch();
		}, [])
	);

	if (loading) return <ActivityIndicator size='large' />;
	if (error) return <Text>Error loading history</Text>;

	// ✅ Filter and sort
	let completedOrders = orders.filter((order: Order) => {
		if (order.status !== 'completed') return false;
		if (!order.updatedAt) return false;
		const updated = new Date(order.updatedAt);
		const inFrom = fromDate ? updated >= fromDate : true;
		const inTo = toDate ? updated <= toDate : true;
		const isValid =
			isSitter || (!!order.rating && order.status === 'completed');
		return isValid && inFrom && inTo;
	});

	completedOrders.sort((a, b) => {
		const dateA = new Date(a.updatedAt).getTime();
		const dateB = new Date(b.updatedAt).getTime();
		return sortNewestFirst ? dateB - dateA : dateA - dateB;
	});

	const resetFilters = () => {
		setFromDate(null);
		setToDate(null);
		setSortNewestFirst(true);
	};

	return (
		<ScrollView className='p-5'>
			<Text className='text-2xl font-PoppinsSemiBold mb-3'>Order History</Text>

			{/* Filter controls */}
			<View className='flex-row justify-between items-center mb-3 flex-wrap gap-3'>
				<TouchableOpacity onPress={() => setShowFromPicker(true)}>
					<Text className='text-primary'>
						From: {fromDate ? fromDate.toLocaleDateString() : '—'}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => setShowToPicker(true)}>
					<Text className='text-primary'>
						To: {toDate ? toDate.toLocaleDateString() : '—'}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={resetFilters}>
					<Text className='text-red-400 font-PoppinsMedium'>Reset</Text>
				</TouchableOpacity>
			</View>

			<View className='flex-row justify-between mb-3'>
				<Text className='text-sm text-gray-500'>
					Total: {completedOrders.length} completed orders
				</Text>
				<TouchableOpacity onPress={() => setSortNewestFirst((prev) => !prev)}>
					<Text className='text-blue-500 font-PoppinsMedium'>
						{sortNewestFirst ? 'Newest First' : 'Oldest First'}
					</Text>
				</TouchableOpacity>
			</View>

			{/* Date pickers */}
			{showFromPicker && (
				<DateTimePicker
					value={fromDate || new Date()}
					mode='date'
					display='default'
					onChange={(_, date) => {
						setShowFromPicker(false);
						if (date) setFromDate(date);
					}}
				/>
			)}

			{showToPicker && (
				<DateTimePicker
					value={toDate || new Date()}
					mode='date'
					display='default'
					onChange={(_, date) => {
						setShowToPicker(false);
						if (date) setToDate(date);
					}}
				/>
			)}

			{/* Orders */}
			{completedOrders.length === 0 ? (
				<Text className='text-center text-gray-500 mt-5'>
					No completed orders found
				</Text>
			) : (
				completedOrders.map((order: Order) => (
					<TouchableOpacity
						key={order.id}
						className='mb-4 p-4 bg-white rounded-2xl shadow'
						onPress={() =>
							router.push({
								pathname: '/(pages)/(orders)/orderCard',
								params: { order: JSON.stringify(order) }
							})
						}
					>
						<Text className='text-xl font-PoppinsSemiBold mb-2'>
							Order #{order.id}
						</Text>
						<Text className='text-base text-darkgray mb-1'>
							Pet: {order.pet?.species || '—'}
						</Text>
						<Text className='text-base text-darkgray mb-1'>
							Service: {order.services.join(', ')}
						</Text>
						<Text className='text-base text-green-600 font-PoppinsMedium'>
							Status: Completed
						</Text>
						<Text className='text-sm text-gray-500 mt-1'>
							Completed on: {formatDateTime(order.updatedAt)} (
							{timeAgo(order.updatedAt)})
						</Text>
						{isSitter && order.rating && (
							<Text className='text-sm mt-1'>⭐ {order.rating}/5</Text>
						)}
					</TouchableOpacity>
				))
			)}
		</ScrollView>
	);
};

export default HistoryList;

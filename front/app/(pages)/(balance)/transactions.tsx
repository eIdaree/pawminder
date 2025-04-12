import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator
} from 'react-native';
import { useBalance } from '@/context/BalanceContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateTime, timeAgo } from '@/helper/date';
import { BackButton } from '@/components/shared/BackButton';

const TransactionsPage = () => {
	const { transactions, loading } = useBalance();

	const [fromDate, setFromDate] = useState<Date | null>(null);
	const [toDate, setToDate] = useState<Date | null>(null);
	const [sortNewestFirst, setSortNewestFirst] = useState(true);
	const [showFromPicker, setShowFromPicker] = useState(false);
	const [showToPicker, setShowToPicker] = useState(false);

	if (loading) return <ActivityIndicator size='large' />;

	let filtered = transactions.filter((tx) => {
		const date = new Date(tx.createdAt);
		const inFrom = fromDate ? date >= fromDate : true;
		const inTo = toDate ? date <= toDate : true;
		return inFrom && inTo;
	});

	filtered.sort((a, b) => {
		const aTime = new Date(a.createdAt).getTime();
		const bTime = new Date(b.createdAt).getTime();
		return sortNewestFirst ? bTime - aTime : aTime - bTime;
	});

	const resetFilters = () => {
		setFromDate(null);
		setToDate(null);
		setSortNewestFirst(true);
	};

	return (
		<>
			<BackButton />
			<ScrollView className='p-5 mt-3'>
				<Text className='text-2xl font-PoppinsSemiBold mb-10 text-center'>
					Transactions
				</Text>

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
						Total: {filtered.length} transactions
					</Text>
					<TouchableOpacity onPress={() => setSortNewestFirst((prev) => !prev)}>
						<Text className='text-blue-500 font-PoppinsMedium'>
							{sortNewestFirst ? 'Newest First' : 'Oldest First'}
						</Text>
					</TouchableOpacity>
				</View>

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

				{filtered.length === 0 ? (
					<Text className='text-center text-gray-500 mt-5'>
						No transactions found
					</Text>
				) : (
					filtered.map((tx) => (
						<View
							key={tx.id}
							className='mb-4 p-4 bg-white rounded-2xl shadow border-l-4'
							style={{
								borderLeftColor: tx.type === 'income' ? '#16a34a' : '#dc2626'
							}}
						>
							<Text className='text-lg font-PoppinsSemiBold'>
								{tx.type === 'income' ? 'Received' : 'Spent'} ₸{tx.amount}
							</Text>
							<Text className='text-sm text-gray-500'>
								{formatDateTime(tx.createdAt)} ({timeAgo(tx.createdAt)})
							</Text>
							<Text className='text-sm mt-1 text-gray-600'>
								{tx.description}
							</Text>
						</View>
					))
				)}
			</ScrollView>
		</>
	);
};

export default TransactionsPage;

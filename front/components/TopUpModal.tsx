import React, { useState } from 'react';
import {
	View,
	Text,
	Modal,
	TextInput,
	TouchableOpacity,
	Alert
} from 'react-native';
import { useBalance } from '@/context/BalanceContext';

interface TopUpModalProps {
	visible: boolean;
	onClose: () => void;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ visible, onClose }) => {
	const [amount, setAmount] = useState('');
	const { topUp } = useBalance();

	const handleTopUp = async () => {
		const numericAmount = Number(amount);
		if (isNaN(numericAmount) || numericAmount <= 0) {
			return Alert.alert('Error', 'Please enter a valid amount');
		}

		try {
			await topUp(numericAmount);
			Alert.alert('Success', 'Your balance has been topped up successfully');
			setAmount('');
			onClose();
		} catch (err) {
			console.error(err);
			Alert.alert('Error', 'Failed to top up balance. Please try again later.');
		}
	};

	return (
		<Modal visible={visible} animationType='slide' transparent>
			<View className='flex-1 justify-center items-center bg-black/40 px-5'>
				<View className='bg-white w-full rounded-xl p-6'>
					<Text className='text-xl font-PoppinsSemiBold mb-3 text-center'>
						Top Up Your Balance
					</Text>
					<TextInput
						className='border border-gray-300 rounded-xl px-4 py-3 mb-4'
						placeholder='Enter the balance (₸)'
						keyboardType='numeric'
						value={amount}
						onChangeText={setAmount}
					/>
					<TouchableOpacity
						className='bg-primary py-3 rounded-xl mb-2'
						onPress={handleTopUp}
					>
						<Text className='text-center text-white font-PoppinsSemiBold'>
							Top Up
						</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={onClose}>
						<Text className='text-center text-gray-500'>Cancel</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

export default TopUpModal;

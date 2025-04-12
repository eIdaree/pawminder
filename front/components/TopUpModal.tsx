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
			return Alert.alert('Ошибка', 'Введите корректную сумму');
		}

		try {
			await topUp(numericAmount);
			Alert.alert('Успех', 'Баланс успешно пополнен');
			setAmount('');
			onClose();
		} catch (err) {
			console.error(err);
			Alert.alert('Ошибка', 'Не удалось пополнить баланс');
		}
	};

	return (
		<Modal visible={visible} animationType='slide' transparent>
			<View className='flex-1 justify-center items-center bg-black/40 px-5'>
				<View className='bg-white w-full rounded-xl p-6'>
					<Text className='text-xl font-PoppinsSemiBold mb-3 text-center'>
						Пополнить баланс
					</Text>
					<TextInput
						className='border border-gray-300 rounded-xl px-4 py-3 mb-4'
						placeholder='Введите сумму (₸)'
						keyboardType='numeric'
						value={amount}
						onChangeText={setAmount}
					/>
					<TouchableOpacity
						className='bg-primary py-3 rounded-xl mb-2'
						onPress={handleTopUp}
					>
						<Text className='text-center text-white font-PoppinsSemiBold'>
							Пополнить
						</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={onClose}>
						<Text className='text-center text-gray-500'>Отмена</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

export default TopUpModal;

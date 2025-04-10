import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	ScrollView,
	Alert,
	TouchableOpacity
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import SitterCard from '@/components/SitterCard';
import DateTimePicker from '@react-native-community/datetimepicker';
import CollapsibleCheckboxGroup from '@/components/shared/CollapsibleCheckboxGroup/CollapsibleCheckboxGroup';
import { usePets } from '@/context/PetContext';
import RNPickerSelect from 'react-native-picker-select';
import { BackButton } from '@/components/shared/BackButton';
import { tokenCache } from '@/utils/auth';
import { useOrders } from '@/hooks/useOrders';

const OrderForm = () => {
	const sitter = useLocalSearchParams();
	const { user } = useAuth();
	const { pets } = usePets();
	const { refetch } = useOrders();
	sitter.skills = sitter.skills?.split(',') || [];
	sitter.petTypes = sitter.petTypes?.split(',') || [];
	const [selectedPet, setSelectedPet] = useState(null);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [services, setServices] = useState<string[]>([]);
	const [careTime, setCareTime] = useState('');
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);
	const [phone, setPhone] = useState(user.phone);

	const [fee, setFee] = useState('');

	const handleSubmit = async () => {
		if (!selectedPet || !careTime || !fee) {
			Alert.alert('Ошибка', 'Заполните все поля!');
			return;
		}

		const orderData = {
			sitterId: Number(sitter.id),
			ownerId: user.id,
			petId: selectedPet.id,
			startDate,
			endDate,
			careTime,
			services,
			fee: Number(fee)
		};

		try {
			const token = await tokenCache.getToken('auth-token');
			const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/orders`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(orderData)
			});
			await refetch();

			if (!res.ok) {
				console.log('res', res);
				throw new Error('Ошибка при создании заказа');
			}

			Alert.alert('Успех', 'Заявка отправлена!', [
				{
					text: 'Ок',
					onPress: () => router.replace('/(pages)/(orders)/orderList') // путь на твою страницу заказов
				}
			]);
		} catch (err) {
			console.error('Ошибка:', err);
			Alert.alert('Ошибка', 'Не удалось отправить заявку');
		}
	};
	const onSubmit = () => {
		Alert.alert('Confirmation', 'Are you sure about the data?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Yes', onPress: handleSubmit }
		]);
	};

	const headerTitleInputStyle = 'font-PoppinsSemiBold text-base  mb-2';
	const inputStyle =
		'border-lightgray border rounded-xl bg-white py-3 px-4 mb-2';
	return (
		<>
			<BackButton />
			<ScrollView className='p-6' contentContainerStyle={{ paddingBottom: 60 }}>
				<Text className='text-3xl font-PoppinsSemiBold mb-2 mt-10'>
					Order Form
				</Text>
				<Text className=' mb-6 text-gray-500 font-PoppinsRegular'>
					Fill the form in the down bellow
				</Text>

				{/* Няня */}
				<SitterCard sitter={sitter as any} hideActions />

				{/* Владелец */}
				<Text className={headerTitleInputStyle}>Owner Info</Text>
				<TextInput
					className={inputStyle}
					value={user.first_name + ' ' + user.last_name}
					editable={false}
				/>
				<TextInput
					className={inputStyle}
					value={phone || user.phone}
					placeholder='Phone number'
					keyboardType='phone-pad'
					onChangeText={setPhone}
					editable={true}
				/>

				{/* Питомец */}
				<Text className={headerTitleInputStyle}>Pet Info</Text>
				<RNPickerSelect
					value={selectedPet?.id}
					onValueChange={(petId) => {
						const pet = pets.find((p) => p.id === petId);
						setSelectedPet(pet || null);
					}}
					items={pets.map((pet) => ({
						label: pet.name,
						value: pet.id
					}))}
					placeholder={{ label: 'Select your pet', value: null }}
					style={{
						inputIOS: {
							color: 'black',
							textAlignVertical: 'center',
							fontSize: 14
						},
						inputAndroid: {
							color: 'black',
							textAlignVertical: 'center',
							fontSize: 14
						},

						viewContainer: {
							borderRadius: 10,
							borderWidth: 1,
							borderColor: 'lightgray',
							paddingHorizontal: 2,
							backgroundColor: 'white',
							height: 46,
							justifyContent: 'center',
							marginBottom: 8
						},
						placeholder: {
							color: 'gray'
						}
					}}
				/>
				<TextInput
					className={inputStyle}
					value={selectedPet?.species || ''}
					placeholder='Species (cat/dog)'
					editable={false}
				/>
				{/* Даты и время */}
				<Text className={headerTitleInputStyle}>Dates, times, and fees</Text>
				<TouchableOpacity
					onPress={() => setShowStartPicker(true)}
					className={inputStyle}
				>
					<Text>Start Date: {startDate.toLocaleDateString()}</Text>
				</TouchableOpacity>
				{showStartPicker && (
					<DateTimePicker
						value={startDate}
						mode='date'
						display='default'
						onChange={(_, date) => {
							setShowStartPicker(false);
							if (date) {
								if (date > endDate) {
									Alert.alert(
										'Ошибка',
										'Дата начала не может быть позже даты окончания'
									);
									return;
								}
								setStartDate(date);
							}
						}}
					/>
				)}

				<TouchableOpacity
					onPress={() => setShowEndPicker(true)}
					className={inputStyle}
				>
					<Text>End Date: {endDate.toLocaleDateString()}</Text>
				</TouchableOpacity>
				{showEndPicker && (
					<DateTimePicker
						value={endDate}
						mode='date'
						display='default'
						onChange={(_, date) => {
							setShowEndPicker(false);
							if (date) {
								if (date < startDate) {
									Alert.alert(
										'Ошибка',
										'Дата начала не может быть раньше даты начала'
									);
									return;
								}
								setStartDate(date);
							}
						}}
					/>
				)}

				<TextInput
					className={inputStyle}
					placeholder='Care time (hours or full day)'
					value={careTime}
					onChangeText={setCareTime}
				/>

				<TextInput
					className={inputStyle}
					placeholder='Estimated fee (₸)'
					keyboardType='numeric'
					value={fee}
					onChangeText={setFee}
				/>

				{/* Услуги */}
				<Text className={headerTitleInputStyle}>Necessary Services</Text>
				<CollapsibleCheckboxGroup
					title='Choose services'
					options={['Sitter/owner care', 'Walking', 'Feeding']}
					selected={services}
					onChange={setServices}
				/>

				<TouchableOpacity
					onPress={onSubmit}
					className='bg-primary p-4 rounded-xl mt-1'
				>
					<Text className='text-white font-bold text-center'>
						Submit an application
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</>
	);
};

export default OrderForm;

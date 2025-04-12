import React, { useReducer, useEffect, useState } from 'react';
import {
	View,
	Text,
	Alert,
	Image,
	TextInput,
	FlatList,
	Pressable,
	TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Button } from '@/components/shared/Button';
import animalTypes from './petsTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { ArrowButton } from '@/components/shared/ArrowButton/ArrowButton';
import { icons, genders } from '@/constants';
import { PetFormState } from '@/types/types';
import { useAuth } from '@/context/AuthContext';
import { tokenCache } from '@/utils/auth';
import { usePets } from '@/context/PetContext';
import { router } from 'expo-router';

// Расширяем состояние: добавляем два новых поля (опционально)
const initialState: PetFormState = {
	type: '',
	breed: '',
	name: '',
	photo: null,
	gender: '',
	birthDate: '',
	weight: '',
	color: '',
	character: [],
	activity: [],
	// Новые поля:
	petDescription: '',
	additionalNotes: ''
};

type RootStackParamList = {
	PetProfile: { pet: PetFormState };
};

// Обновляем схему валидации. Новые поля задаём как необязательные.
const schema = yup.object().shape({
	type: yup.string().required('Choose type of pet'),
	name: yup.string().required('The name for pet is required'),
	weight: yup.string().required('Enter weight of your pet'),
	birthDate: yup.string().required('Enter date of birth'),
	color: yup.string().required('Enter color of your pet'),
	breed: yup.string(),
	gender: yup.string(),
	activity: yup.array().of(yup.string()).min(1, 'Choose at least one activity'),
	character: yup
		.array()
		.of(yup.string())
		.min(1, 'Choose at least one personality trait'),
	photo: yup.string().nullable(),
	// Новые поля:
	petDescription: yup.string(),
	additionalNotes: yup.string()
});

// Добавляем выводы в консоль внутри reducer для отладки
const reducer = (
	state: PetFormState,
	action: { type: string; payload?: any }
) => {
	console.log('Reducer action:', action);
	switch (action.type) {
		case 'SET_FIELD': {
			const updatedState = {
				...state,
				[action.payload.field]: action.payload.value
			};
			console.log(
				`Updated state [${action.payload.field}] =`,
				action.payload.value
			);
			return updatedState;
		}
		case 'RESET':
			console.log('Reset state to initial');
			return initialState;
		default:
			console.log('Unhandled action type:', action.type);
			return state;
	}
};

const transformPetData = (state: PetFormState) => {
	console.log('Transforming pet data:', state);
	return {
		name: state.name,
		species: state.type,
		weight: Number(state.weight),
		color: state.color,
		gender: state.gender,
		activity: state.activity,
		character: state.character,
		breed: state.breed,
		date_of_birth: state.birthDate,
		photo: state.photo,
		// Передаём новые поля
		petDescription: state.petDescription,
		additionalNotes: state.additionalNotes
	};
};

const AddPet = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	// Теперь у нас 12 шагов ввода, финальный экран – шаг 13
	const [step, setStep] = useState(1);
	const [showDropdown, setShowDropdown] = useState(false);
	const [customTypeInput, setCustomTypeInput] = useState('');
	const [showDatePicker, setShowDatePicker] = useState(false);
	const { user } = useAuth();
	const { fetchPets } = usePets();
	const {
		control,
		formState: { errors },
		setValue
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: initialState
	});

	// Вывод доступных типов питомцев для отладки
	useEffect(() => {
		console.log('Available animal types:', Object.keys(animalTypes));
	}, []);

	// Загружаем данные из AsyncStorage и выводим в консоль для отладки
	useEffect(() => {
		(async () => {
			try {
				const savedData = await AsyncStorage.getItem('petForm');
				console.log('Loaded saved pet form data:', savedData);
				if (savedData) {
					const parsedData = JSON.parse(savedData);
					Object.entries(parsedData).forEach(([field, value]) => {
						dispatch({ type: 'SET_FIELD', payload: { field, value } });
						if (field in initialState) {
							setValue(field as keyof PetFormState, value);
						}
					});
				}
			} catch (error) {
				console.error('Error loading pet form data from storage:', error);
			}
		})();
	}, []);

	// Логируем изменения состояния формы
	useEffect(() => {
		console.log('Current form state:', state);
	}, [state]);

	// Сохраняем данные формы, добавив логирование
	useEffect(() => {
		AsyncStorage.setItem('petForm', JSON.stringify(state))
			.then(() => console.log('Form state saved to storage'))
			.catch((error) => console.error('Error saving form state:', error));
	}, [state]);

	const validateAllFields = (): string | null => {
		// Обязательные поля оставляем без новых (необязательных) вопросов
		const requiredFields: (keyof PetFormState)[] = [
			'type',
			'breed',
			'gender',
			'photo',
			'name',
			'weight',
			'birthDate',
			'color',
			'activity',
			'character'
		];

		for (const field of requiredFields) {
			const value = state[field];
			// Если поле является массивом, проверяем его длину
			if (Array.isArray(value)) {
				if (value.length === 0) {
					console.log('Validation error: missing selection in', field);
					return field;
				}
			} else if (!value || value.toString().trim() === '') {
				console.log('Validation error: missing field', field);
				return field;
			}
		}
		return null; // Всё ок
	};

	const nextStep = () => {
		console.log('Next step pressed at step:', step);
		// Если на первом шаге тип питомца не выбран, выдаём предупреждение
		if (step === 1 && state.type === '') {
			Alert.alert('Error', 'Please choose the type of pet');
			return;
		}
		if (step === 2 && state.type === '🐾 Other') {
			// Пользователь вводит кастомный тип питомца
			console.log('Custom type provided:', customTypeInput);
			handleSelection('type', customTypeInput);
			handleSelection('breed', '');
		}
		// Когда введены все данные (шаг ввода 12) – вызываем onSubmit
		if (step === 12) {
			onSubmit();
			return;
		}
		setStep((prev) => prev + 1);
	};

	const prevStep = () => {
		console.log('Previous step pressed at step:', step);
		setStep((prev) => Math.max(1, prev - 1));
	};

	const handlePhotoUpload = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		console.log('Media library permission status:', status);
		if (status !== 'granted') {
			Alert.alert('Ошибка', 'Вы должны разрешить доступ к галерее!');
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		});

		console.log('ImagePicker result:', result);
		if (!result.canceled && result.assets?.length) {
			dispatch({
				type: 'SET_FIELD',
				payload: { field: 'photo', value: result.assets[0].uri }
			});
		}
	};

	const navigation =
		useNavigation<
			NativeStackNavigationProp<RootStackParamList, 'PetProfile'>
		>();

	const onSubmit = () => {
		console.log('Submit pressed, current state:', state);
		const missingField = validateAllFields();
		if (missingField) {
			Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля!');
			return;
		}
		Alert.alert('Confirmation', 'Are you sure about the data?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Yes', onPress: sendDataToServer }
		]);
	};

	const sendDataToServer = async () => {
		console.log('Sending data to server', state);
		try {
			const transformedData = transformPetData(state);
			console.log('Transformed data:', transformedData);
			const petResponse = await fetch(
				`${process.env.EXPO_PUBLIC_BASE_URL}/pets/${user.id}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(transformedData)
				}
			);
			console.log('Server response:', petResponse);
			if (!petResponse.ok) {
				const errorDetails = await petResponse.text();
				console.error('Error response:', errorDetails);
				throw new Error('Ошибка при добавлении питомца');
			}

			const pet = await petResponse.json();
			const token = await tokenCache.getToken('auth-token');
			let photoUrl = null;
			if (state.photo) {
				const formData = new FormData();
				formData.append('file', {
					uri: state.photo,
					name: 'photo.jpg',
					type: 'image/jpeg'
				} as unknown as Blob);

				const uploadResponse = await fetch(
					`${process.env.EXPO_PUBLIC_BASE_URL}/upload/${pet.id}`,
					{
						method: 'POST',
						body: formData,
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);

				if (!uploadResponse.ok) {
					const errorDetails = await uploadResponse.text();
					console.error('Error response during photo upload:', errorDetails);
					throw new Error('Ошибка загрузки фото');
				}
				const uploadData = await uploadResponse.json();
				photoUrl = uploadData.url;
				console.log('Uploaded photo URL:', photoUrl);
			}

			if (photoUrl) {
				const patchResponse = await fetch(
					`${process.env.EXPO_PUBLIC_BASE_URL}/pets/${pet.id}`,
					{
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ photoUrl })
					}
				);
				console.log('Patch photo response:', patchResponse);
			}

			await fetchPets();
			dispatch({ type: 'RESET' });
			await AsyncStorage.removeItem('petForm');
			console.log('Form reset complete, navigating to final step');
			// Финальный экран – шаг 13
			setStep(13);
		} catch (error: any) {
			Alert.alert('Ошибка', error.message);
		}
	};

	const handleSelection = (field: keyof PetFormState, value: string) => {
		console.log(`handleSelection: field = ${field}, value = ${value}`);
		dispatch({ type: 'SET_FIELD', payload: { field, value } });
	};
	const toggleSelection = (field: keyof PetFormState, item: string) => {
		// Предполагаем, что значение поля — это массив строк
		const current = (state[field] as unknown as string[]) || [];
		if (current.includes(item)) {
			// Если уже выбран, удаляем элемент
			const updated = current.filter((el) => el !== item);
			dispatch({ type: 'SET_FIELD', payload: { field, value: updated } });
		} else {
			// Если не выбран, добавляем элемент
			const updated = [...current, item];
			dispatch({ type: 'SET_FIELD', payload: { field, value: updated } });
		}
	};

	const textInput = 'mb-10 text-center text-2xl font-InterSemiBold text-text';
	const box = 'p-4 border rounded-3xl m-1';

	return (
		<>
			<View className='flex-1 p-4 bg-white'>
				{/* Обновлён прогресс-бар: общее кол-во шагов ввода – 12 */}
				<View className='h-2 w-full border-primary border rounded-full overflow-hidden mb-4'>
					<View
						className='h-full bg-primary'
						style={{ width: `${((step <= 12 ? step : 12) / 12) * 100}%` }}
					/>
				</View>

				<Text className='text-base text-subtext font-bold mb-4 text-center font-InterBold'>
					Question {step}
				</Text>

				<Animated.View key={step} entering={FadeInRight} exiting={FadeOutLeft}>
					{step === 1 && (
						<View>
							<Text className={textInput}>What type of pet do you have?</Text>
							<FlatList
								data={Object.keys(animalTypes)}
								renderItem={({ item, index }) => {
									console.log(
										'Rendering animal type option:',
										item,
										'at index:',
										index
									);
									return (
										<Pressable
											onPress={() => handleSelection('type', item)}
											className={`${box} ${
												state.type === item ? 'bg-primary' : 'bg-white'
											}`}
										>
											<Text
												className={`${
													state.type === item
														? 'text-white font-InterBold'
														: 'text-black font-InterMedium'
												} text-center text-xl`}
											>
												{item}
											</Text>
										</Pressable>
									);
								}}
								keyExtractor={(item) => item}
								ListEmptyComponent={() => (
									<Text className='text-red-500'>
										Список типов питомцев пуст или произошла ошибка загрузки.
									</Text>
								)}
							/>
							{errors.type && (
								<Text className='text-red-500'>{errors.type.message}</Text>
							)}
						</View>
					)}

					{step === 2 && (
						<View>
							{state.type === '🐾 Other' ? (
								<>
									<Text className={textInput}>
										Please write down your pet species
									</Text>
									<TextInput
										className={`${box} border-subtext font-InterMedium text-base`}
										placeholder='Type here...'
										value={customTypeInput}
										onChangeText={(text) => {
											console.log('Custom type input changed:', text);
											setCustomTypeInput(text);
										}}
									/>
								</>
							) : (
								<View>
									<Text className={textInput}>What is your pet’s breed?</Text>
									<View className='border border-primary rounded-3xl bg-white overflow-hidden'>
										<TouchableOpacity
											onPress={() => {
												console.log('Dropdown toggled');
												setShowDropdown(!showDropdown);
											}}
											className='p-4 bg-white rounded-t-3xl'
										>
											<Text className='font-InterMedium text-xl'>
												{state.breed || 'Choose from list'}
											</Text>
										</TouchableOpacity>
										{showDropdown && (
											<FlatList
												data={
													animalTypes[state.type] || ['Choose a type first']
												}
												keyExtractor={(item) => item}
												className='bg-white max-h-80'
												style={{ elevation: 5 }}
												renderItem={({ item, index }) => {
													console.log(
														'Rendering breed option:',
														item,
														'at index:',
														index
													);
													return (
														<TouchableOpacity
															onPress={() => {
																console.log('Breed selected:', item);
																dispatch({
																	type: 'SET_FIELD',
																	payload: { field: 'breed', value: item }
																});
																setShowDropdown(false);
															}}
															className={`p-3 ${
																index !==
																(animalTypes[state.type]?.length || 0) - 1
																	? 'border-b border-subtext'
																	: ''
															} hover:bg-primary hover:text-white`}
														>
															<Text className='font-InterMedium text-xl'>
																{item}
															</Text>
														</TouchableOpacity>
													);
												}}
												ListEmptyComponent={() => (
													<Text className='text-red-500'>
														Нет доступных пород для выбранного типа.
													</Text>
												)}
											/>
										)}
									</View>
								</View>
							)}
						</View>
					)}

					{step === 3 && (
						<View>
							<Text className={textInput}>What is your pet’s name?</Text>
							<Controller
								control={control}
								name='name'
								render={({ field: { onChange, value } }) => (
									<TextInput
										className={`${box} border-subtext font-InterMedium text-base`}
										placeholder='Type here...'
										value={value}
										onChangeText={(text) => {
											console.log('Pet name changed:', text);
											onChange(text);
											handleSelection('name', text);
										}}
									/>
								)}
							/>
							{errors.name && (
								<Text className='text-red-500'>{errors.name.message}</Text>
							)}
						</View>
					)}

					{step === 4 && (
						<View>
							<Text className={textInput}>
								Can you upload a photo of your pet?
							</Text>
							{state.photo ? (
								<Image
									source={{ uri: state.photo }}
									className='w-32 h-32 mt-2 rounded'
								/>
							) : (
								<View className='border-2 border-dashed border-indigo-400 mb-6'>
									<Image
										source={icons.catdog}
										className='w-[201.73px] h-[218px] items-center mx-auto my-11'
									/>
								</View>
							)}
							<Button
								onPress={handlePhotoUpload}
								title='Upload Photo'
								variant='primary'
							/>
						</View>
					)}

					{step === 5 && (
						<View>
							<Text className={textInput}>What is your pet’s gender?</Text>
							<FlatList
								data={genders}
								renderItem={({ item, index }) => {
									console.log(
										'Rendering gender option:',
										item,
										'at index:',
										index
									);
									return (
										<Pressable
											onPress={() => handleSelection('gender', item)}
											className={`${box} ${
												state.gender === item ? 'bg-primary' : 'bg-white'
											}`}
										>
											<Text
												className={`${
													state.gender === item
														? 'text-white font-InterBold'
														: 'text-black font-InterMedium'
												} text-center text-xl`}
											>
												{item}
											</Text>
										</Pressable>
									);
								}}
								keyExtractor={(item) => item}
							/>
						</View>
					)}

					{step === 6 && (
						<View>
							<Text className={textInput}>
								What is your pet’s date of birth?
							</Text>
							<TouchableOpacity
								className={`${box} border-subtext font-InterMedium text-base`}
								onPress={() => setShowDatePicker(true)}
							>
								<Text className='text-lg text-center'>
									{state.birthDate || 'Select date'}
								</Text>
							</TouchableOpacity>
							{showDatePicker && (
								<DateTimePicker
									value={
										state.birthDate ? new Date(state.birthDate) : new Date()
									}
									mode='date'
									display='spinner'
									onChange={(event, selectedDate) => {
										setShowDatePicker(false);
										if (selectedDate) {
											const formattedDate = selectedDate
												.toISOString()
												.split('T')[0];
											console.log('Date selected:', formattedDate);
											handleSelection('birthDate', formattedDate);
										}
									}}
								/>
							)}
							{errors.birthDate && (
								<Text className='text-red-500'>{errors.birthDate.message}</Text>
							)}
						</View>
					)}

					{step === 7 && (
						<View>
							<Text className={textInput}>What is your pet’s weight?(kg)</Text>
							<Controller
								control={control}
								name='weight'
								render={({ field: { onChange, value } }) => (
									<TextInput
										className={`${box} border-subtext font-InterMedium text-base`}
										placeholder='Type here...'
										value={value}
										keyboardType='numeric'
										onChangeText={(text) => {
											console.log('Pet weight changed:', text);
											onChange(text);
											handleSelection('weight', text);
										}}
									/>
								)}
							/>
							{errors.weight && (
								<Text className='text-red-500'>{errors.weight.message}</Text>
							)}
						</View>
					)}

					{step === 8 && (
						<View>
							<Text className={textInput}>
								What color or markings does your pet have?
							</Text>
							<Controller
								control={control}
								name='color'
								render={({ field: { onChange, value } }) => (
									<TextInput
										className={`${box} border-subtext font-InterMedium text-base`}
										placeholder='Type here...'
										value={value}
										onChangeText={(text) => {
											console.log('Pet color changed:', text);
											onChange(text);
											handleSelection('color', text);
										}}
									/>
								)}
							/>
						</View>
					)}

					{step === 9 && (
						<View>
							<Text className={textInput}>
								How would you describe your pet’s personality?
							</Text>
							<FlatList
								data={['Playful', 'Friendly', 'Shy', 'Protective', 'Calm']}
								renderItem={({ item, index }) => {
									console.log(
										'Rendering personality option:',
										item,
										'at index:',
										index
									);
									return (
										<Pressable
											onPress={() => toggleSelection('character', item)}
											className={`${box} ${
												state.character &&
												(state.character as string[]).includes(item)
													? 'bg-primary'
													: 'bg-white'
											}`}
										>
											<Text
												className={`${
													state.character &&
													(state.character as string[]).includes(item)
														? 'text-white font-InterBold'
														: 'text-black font-InterMedium'
												} text-center text-xl`}
											>
												{item}
											</Text>
										</Pressable>
									);
								}}
								keyExtractor={(item) => item}
							/>
							{errors.character && (
								<Text className='text-red-500'>{errors.character.message}</Text>
							)}
						</View>
					)}

					{step === 10 && (
						<View>
							<Text className={textInput}>
								What are your pet’s favorite activities?
							</Text>
							<FlatList
								data={[
									'Playing with toys',
									'Running / Exercise',
									'Sleeping',
									'Eating treats'
								]}
								renderItem={({ item, index }) => {
									console.log(
										'Rendering activity option:',
										item,
										'at index:',
										index
									);
									return (
										<Pressable
											onPress={() => toggleSelection('activity', item)}
											className={`${box} ${
												(state.activity as unknown as string[]).includes(item)
													? 'bg-primary'
													: 'bg-white'
											}`}
										>
											<Text
												className={`${
													(state.activity as unknown as string[]).includes(item)
														? 'text-white font-InterBold'
														: 'text-black font-InterMedium'
												} text-center text-xl`}
											>
												{item}
											</Text>
										</Pressable>
									);
								}}
								keyExtractor={(item) => item}
							/>
							{errors.activity && (
								<Text className='text-red-500'>{errors.activity.message}</Text>
							)}
						</View>
					)}

					{/* Новый шаг 11: дополнительная информация о питомце */}
					{step === 11 && (
						<View>
							<Text className={textInput}>Tell more about your pet</Text>
							<Controller
								control={control}
								name='petDescription'
								render={({ field: { onChange, value } }) => (
									<TextInput
										className={`${box} border-subtext font-InterMedium text-base`}
										placeholder='Describe your pet in more detail...'
										value={value}
										multiline
										onChangeText={(text) => {
											console.log('Pet description changed:', text);
											onChange(text);
											handleSelection('petDescription', text);
										}}
									/>
								)}
							/>
						</View>
					)}

					{/* Новый шаг 12: дополнительные примечания */}
					{step === 12 && (
						<View>
							<Text className={textInput}>Additional notes</Text>
							<Controller
								control={control}
								name='additionalNotes'
								render={({ field: { onChange, value } }) => (
									<TextInput
										className={`${box} border-subtext font-InterMedium text-base`}
										placeholder='Any additional notes...'
										value={value}
										multiline
										onChangeText={(text) => {
											console.log('Additional notes changed:', text);
											onChange(text);
											handleSelection('additionalNotes', text);
										}}
									/>
								)}
							/>
						</View>
					)}

					{/* Финальный экран: Done (шаг 13) */}
					{step === 13 && (
						<View>
							<Text className={textInput}>Done!</Text>
							<Text>Let's go to see pet profile!</Text>
							<Image source={icons.dogsmile} className='w-32 h-32 mt-2' />
							<Button
								title='Let see!'
								variant='primary'
								size='lg'
								onPress={() =>
									router.replace({
										pathname: '/(pages)/(pets)/PetProfile',
										params: state
									})
								}
							/>
						</View>
					)}
				</Animated.View>

				<View className='absolute bottom-4 left-0 right-0 flex-row px-4'>
					{step > 1 ? (
						<View className='flex-row justify-between w-full'>
							{step === 13 ? (
								''
							) : (
								<ArrowButton onPress={prevStep} direction='left' />
							)}
							{step < 13 && (
								<ArrowButton onPress={nextStep} direction='right' />
							)}
						</View>
					) : (
						<View className='flex-row justify-end w-full'>
							<ArrowButton onPress={nextStep} direction='right' />
						</View>
					)}
				</View>
			</View>
		</>
	);
};

export default AddPet;

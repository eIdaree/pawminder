import React, { useReducer, useEffect, useState, useContext } from 'react';
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
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Button } from '@/components/shared/Button';
import RNPickerSelect from 'react-native-picker-select';
import animalTypes from './petsTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { ArrowButton } from '@/components/shared/ArrowButton/ArrowButton';
import { icons } from '@/constants';
import { genders } from '@/constants';
import { PetFormState } from '@/types/types';
import { useAuth } from '@/context/AuthContext';
import { tokenCache } from '@/utils/auth';
import { usePets } from '@/context/PetContext';

const initialState: PetFormState = {
	type: '',
	breed: '',
	name: '',
	photo: null,
	gender: '',
	birthDate: '',
	weight: '',
	color: '',
	character: '',
	activity: ''
};

type RootStackParamList = {
	PetProfile: { pet: PetFormState };
};

const schema = yup.object().shape({
	type: yup.string().required('Choose type of pet'),
	name: yup.string().required('The name for pet is required'),
	weight: yup.string().required('Enter weight of your pet'),
	birthDate: yup.string().required('Enter date of birth'),
	color: yup.string().required('Enter color of your pet'),
	breed: yup.string(),
	gender: yup.string(),
	activity: yup.string(),
	character: yup.string(),
	photo: yup.string().nullable()
});

const reducer = (
	state: PetFormState,
	action: { type: string; payload?: any }
) => {
	switch (action.type) {
		case 'SET_FIELD':
			return { ...state, [action.payload.field]: action.payload.value };
		case 'RESET':
			return initialState;
		default:
			return state;
	}
};
const transformPetData = (state: PetFormState) => {
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
		photo: state.photo
	};
};

const AddPet = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [step, setStep] = useState(1);
	const [showDropdown, setShowDropdown] = useState(false);
	const [customTypeInput, setCustomTypeInput] = useState('');
	const [showDatePicker, setShowDatePicker] = useState(false);
	const { user } = useAuth();
	const { fetchPets } = usePets();
	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: initialState
	});

	useEffect(() => {
		(async () => {
			const savedData = await AsyncStorage.getItem('petForm');
			if (savedData) {
				const parsedData = JSON.parse(savedData);
				Object.entries(parsedData).forEach(([field, value]) => {
					dispatch({ type: 'SET_FIELD', payload: { field, value } });

					if (field in initialState) {
						setValue(field as keyof PetFormState, value);
					}
				});
			}
		})();
	}, []);
	const validateAllFields = (): string | null => {
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
			if (!state[field] || state[field].toString().trim() === '') {
				return field;
			}
		}

		return null; // Всё ок
	};

	useEffect(() => {
		AsyncStorage.setItem('petForm', JSON.stringify(state));
	}, [state]);

	const nextStep = () => {
		if (step === 1 && state.type === '') {
			Alert.alert('Error', 'Please choose the type of pet');
			return;
		}

		if (step === 10) {
			onSubmit();
			return;
		}
		if (step === 2 && state.type === 'Other') {
			handleSelection('type', customTypeInput);
			handleSelection('breed', '');
		}
		setStep((prev) => prev + 1);
	};
	const prevStep = () => setStep((prev) => Math.max(1, prev - 1));

	const handlePhotoUpload = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
			console.log(petResponse);
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
					console.error('Error response:', errorDetails);
					throw new Error('Ошибка загрузки фото');
				}
				const uploadData = await uploadResponse.json();
				photoUrl = uploadData.url;
			}

			if (photoUrl) {
				await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/pets/${pet.id}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ photoUrl })
				});
			}

			await fetchPets();
			dispatch({ type: 'RESET' });
			await AsyncStorage.removeItem('petForm');
			setStep(11);
		} catch (error: any) {
			Alert.alert('Ошибка', error.message);
		}
	};

	const handleSelection = (field: keyof PetFormState, value: string) => {
		dispatch({ type: 'SET_FIELD', payload: { field, value } });
	};
	const textInput = 'mb-10 text-center text-2xl font-InterSemiBold text-text';
	const box = 'p-4 border rounded-3xl m-1';

	return (
		<>
			<View className='flex-1 p-4 bg-white'>
				<View className='h-2 w-full border-primary border rounded-full overflow-hidden mb-4'>
					<View
						className='h-full bg-primary'
						style={{ width: `${(step / 10) * 100}%` }}
					/>
				</View>

				<Text className='text-base text-subtext font-bold mb-4 text-center font-InterBold'>
					Question {step}
				</Text>

				<Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
					{step === 1 && (
						<View>
							<Text className={textInput}>What type of pet do you have?</Text>
							<FlatList
								data={Object.keys(animalTypes)}
								renderItem={({ item }) => (
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
								)}
								keyExtractor={(item) => item}
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
										onChangeText={setCustomTypeInput}
									/>
								</>
							) : (
								<View>
									<Text className={textInput}>What is your pet’s breed?</Text>

									{/* Контейнер с общей рамкой */}
									<View className='border border-primary rounded-3xl bg-white overflow-hidden'>
										{/* Кнопка выбора породы */}
										<TouchableOpacity
											onPress={() => setShowDropdown(!showDropdown)}
											className='p-4 bg-white rounded-t-3xl'
										>
											<Text className='font-InterMedium text-xl'>
												{state.breed || 'Choose from list'}
											</Text>
										</TouchableOpacity>

										{/* Выпадающий список */}
										{showDropdown && (
											<FlatList
												data={
													animalTypes[state.type] || ['Choose a type first']
												}
												keyExtractor={(item) => item}
												className='bg-white max-h-80'
												style={{ elevation: 5 }}
												renderItem={({ item, index }) => (
													<TouchableOpacity
														onPress={() => {
															dispatch({
																type: 'SET_FIELD',
																payload: { field: 'breed', value: item }
															});
															setShowDropdown(false);
														}}
														className={`p-3 ${
															index !== animalTypes[state.type]?.length - 1
																? 'border-b border-subtext'
																: ''
														} hover:bg-primary hover:text-white`}
													>
														<Text className='font-InterMedium text-xl'>
															{item}
														</Text>
													</TouchableOpacity>
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
								<View className=' border-2 border-dashed border-indigo-400  mb-6'>
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
								renderItem={({ item }) => (
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
								)}
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
								renderItem={({ item }) => (
									<Pressable
										onPress={() => handleSelection('character', item)}
										className={`${box} ${
											state.character === item ? 'bg-primary' : 'bg-white'
										}`}
									>
										<Text
											className={`${
												state.character === item
													? 'text-white font-InterBold'
													: 'text-black font-InterMedium'
											} text-center text-xl`}
										>
											{item}
										</Text>
									</Pressable>
								)}
								keyExtractor={(item) => item}
							/>
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
								renderItem={({ item }) => (
									<Pressable
										onPress={() => handleSelection('activity', item)}
										className={`${box} ${
											state.activity === item ? 'bg-primary' : 'bg-white'
										}`}
									>
										<Text
											className={`${
												state.activity === item
													? 'text-white font-InterBold'
													: 'text-black font-InterMedium'
											} text-center text-xl`}
										>
											{item}
										</Text>
									</Pressable>
								)}
								keyExtractor={(item) => item}
							/>
						</View>
					)}
					{step === 11 && (
						<View>
							<Text className={textInput}>Done!</Text>
							<Text>Lets go to see pet profile!</Text>
							<Image source={icons.dogsmile} className='w-32 h-32 mt-2' />
							<Button
								title='Let see!'
								variant='primary'
								size='lg'
								onPress={() =>
									navigation.navigate('PetProfile', { pet: state })
								}
							></Button>
						</View>
					)}
				</Animated.View>

				<View className='absolute bottom-4 left-0 right-0 flex-row px-4'>
					{step > 1 ? (
						<View className='flex-row justify-between w-full'>
							{step === 11 ? (
								''
							) : (
								<ArrowButton onPress={prevStep} direction='left' />
							)}
							{step < 11 && (
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

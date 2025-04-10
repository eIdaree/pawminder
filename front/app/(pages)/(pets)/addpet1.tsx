import React, { useEffect, useState } from 'react';
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
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { ArrowButton } from '@/components/shared/ArrowButton/ArrowButton';
import { Button } from '@/components/shared/Button';
import { icons } from '@/constants';
import animalTypes from './petsTypes';
import { genders } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { usePets } from '@/context/PetContext';

const schema = yup.object().shape({
	type: yup.string().required('Choose type of pet'),
	breed: yup.string().optional(),
	name: yup.string().required('The name for pet is required'),
	photo: yup.string().optional(),
	gender: yup.string().required('Select gender'),
	birthDate: yup.string().required('Enter date of birth'),
	weight: yup.string().required('Enter pet weight'),
	color: yup.string().required('Enter color of your pet'),
	character: yup.string().required('Choose character'),
	activity: yup.string().required('Select activity')
});

const defaultValues = {
	type: '',
	breed: '',
	name: '',
	photo: '',
	gender: '',
	birthDate: '',
	weight: '',
	color: '',
	character: '',
	activity: ''
};

const AddPet = () => {
	const { user } = useAuth();
	const { fetchPets } = usePets();
	const navigation = useNavigation();
	const [step, setStep] = useState(1);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [customTypeInput, setCustomTypeInput] = useState('');
	const [showDropdown, setShowDropdown] = useState(false);

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors }
	} = useForm({
		defaultValues,
		resolver: yupResolver(schema)
	});

	const currentType = watch('type');
	const currentBreedList = animalTypes[currentType] || [];

	useEffect(() => {
		const loadSaved = async () => {
			const saved = await AsyncStorage.getItem('petForm');
			if (saved) {
				const parsed = JSON.parse(saved);
				Object.entries(parsed).forEach(([key, value]) => {
					setValue(key, value);
				});
			}
		};
		loadSaved();
	}, []);

	useEffect(() => {
		AsyncStorage.setItem('petForm', JSON.stringify(getValues()));
	}, [watch()]);

	const textInput = 'mb-10 text-center text-2xl font-InterSemiBold text-text';
	const box = 'p-4 border rounded-3xl m-1';

	const nextStep = () => {
		if (step === 10) handleSubmit(onSubmit)();
		else setStep((s) => s + 1);
	};

	const prevStep = () => setStep((s) => Math.max(1, s - 1));

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
			setValue('photo', result.assets[0].uri);
		}
	};

	return (
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
						<Controller
							control={control}
							name='type'
							render={({ field: { onChange, value } }) => (
								<FlatList
									data={Object.keys(animalTypes)}
									keyExtractor={(item) => item}
									renderItem={({ item }) => (
										<Pressable
											onPress={() => onChange(item)}
											className={`${box} ${
												value === item ? 'bg-primary' : 'bg-white'
											}`}
										>
											<Text
												className={`text-center text-xl ${
													value === item
														? 'text-white font-InterBold'
														: 'text-black font-InterMedium'
												}`}
											>
												{item}
											</Text>
										</Pressable>
									)}
								/>
							)}
						/>
						{errors.type && (
							<Text className='text-red-500'>{errors.type.message}</Text>
						)}
					</View>
				)}

				{step === 2 && currentType !== '🐾 Other' && (
					<View>
						<Text className={textInput}>What is your pet’s breed?</Text>
						<TouchableOpacity
							onPress={() => setShowDropdown(!showDropdown)}
							className='p-4 border border-primary rounded-3xl mb-2'
						>
							<Text className='text-xl'>
								{watch('breed') || 'Choose from list'}
							</Text>
						</TouchableOpacity>
						{showDropdown && (
							<FlatList
								data={currentBreedList}
								keyExtractor={(item) => item}
								renderItem={({ item }) => (
									<Pressable
										onPress={() => {
											setValue('breed', item);
											setShowDropdown(false);
										}}
										className='p-3 border-b border-subtext'
									>
										<Text className='text-lg'>{item}</Text>
									</Pressable>
								)}
							/>
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
									onChangeText={onChange}
								/>
							)}
						/>
						{errors.name && (
							<Text className='text-red-500'>{errors.name.message}</Text>
						)}
					</View>
				)}
			</Animated.View>

			<View className='absolute bottom-4 left-0 right-0 flex-row px-4'>
				{step > 1 ? (
					<View className='flex-row justify-between w-full'>
						<ArrowButton onPress={prevStep} direction='left' />
						<ArrowButton onPress={nextStep} direction='right' />
					</View>
				) : (
					<View className='flex-row justify-end w-full'>
						<ArrowButton onPress={nextStep} direction='right' />
					</View>
				)}
			</View>
		</View>
	);
};

export default AddPet;

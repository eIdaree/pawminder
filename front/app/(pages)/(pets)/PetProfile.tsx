import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { BackButton } from '@/components/shared/BackButton';
import { calculateAge } from '@/helper/calculateAge';
import { icons } from '@/constants';
import { Button } from '@/components/shared/Button';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { router, useLocalSearchParams } from 'expo-router';

type RouteParams = {
	params: {
		id?: number;
		name: string;
		species: string;
		breed: string;
		photo: string;
		date_of_birth: string;
		weight: number;
		gender: string;
		character: string | string[];
		activity: string | string[];
		petDescription?: string;
		additionalNotes?: string;
	};
};

const PetProfileScreen = () => {
	const navigation = useNavigation();
	const {
		name,
		species,
		breed,
		photo,
		date_of_birth,
		weight,
		gender,
		character,
		activity,
		petDescription,
		additionalNotes,
		id
	} = useLocalSearchParams<{
		id?: string;
		name?: string;
		species?: string;
		breed?: string;
		photo?: string;
		date_of_birth?: string;
		weight?: string;
		gender?: string;
		character?: string | string[];
		activity?: string | string[];
		petDescription?: string;
		additionalNotes?: string;
	}>();
	console.log(
		'ffff',
		name,
		species,
		breed,
		photo,
		date_of_birth,
		weight,
		gender,
		character,
		activity,
		petDescription,
		additionalNotes,
		id,
		'ffff'
	);

	const activityArray = Array.isArray(activity)
		? activity
		: typeof activity === 'string'
		? activity.split(',').map((item) => item.trim())
		: [];
	const characterArray = Array.isArray(character)
		? character
		: typeof character === 'string'
		? character.split(',').map((item) => item.trim())
		: [];

	const { months, years } = calculateAge(date_of_birth);

	const [isEditMode, setIsEditMode] = useState(false);

	const handleShare = async () => {
		try {
			const html = `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h1>Pet Profile: ${name}</h1>
            <p><strong>Species:</strong> ${species}</p>
            <p><strong>Breed:</strong> ${breed}</p>
            <p><strong>Gender:</strong> ${gender}</p>
            <p><strong>Weight:</strong> ${weight} kg</p>
            <p><strong>Date of Birth:</strong> ${date_of_birth}</p>
            <p><strong>Age:</strong> ${years} years ${months} months</p>
            <p><strong>Personality:</strong> ${characterArray.join(', ')}</p>
            <p><strong>Favorite Activities:</strong> ${activityArray.join(
							', '
						)}</p>
            <p><strong>About:</strong> ${petDescription || '-'}</p>
            <p><strong>Additional Notes:</strong> ${additionalNotes || '-'}</p>
          </body>
        </html>
      `;

			const { uri } = await Print.printToFileAsync({ html });
			if (!(await Sharing.isAvailableAsync())) {
				Alert.alert('Sharing is not available on your platform');
				return;
			}
			await Sharing.shareAsync(uri, {
				mimeType: 'application/pdf',
				dialogTitle: 'Share PDF',
				UTI: 'com.adobe.pdf'
			});
		} catch (error) {
			console.error('Error sharing PDF', error);
			Alert.alert('Error', 'There was an error generating or sharing the PDF.');
		}
	};

	const handleDelete = async () => {
		Alert.alert('Delete Pet', 'Are you sure you want to delete this pet?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				style: 'destructive',
				onPress: async () => {
					try {
						await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/pets/${id}`, {
							method: 'DELETE'
						});
						router.back();

						Alert.alert('Pet deleted');
						navigation.goBack();
					} catch (error) {
						console.error('Delete pet failed', error);
						Alert.alert('Error', 'Failed to delete pet.');
					}
				}
			}
		]);
	};

	return (
		<View className='flex-1 bg-white'>
			<Pressable
				onPress={() => setIsEditMode(!isEditMode)}
				style={{
					position: 'absolute',
					top: 20,
					right: 20,
					zIndex: 20,
					backgroundColor: 'rgba(0,0,0,0.2)',
					padding: 8,
					borderRadius: 20
				}}
			>
				<Text style={{ fontSize: 20 }}>{'✏️'}</Text>
			</Pressable>

			<BackButton />

			<ScrollView className='flex-1'>
				<Image
					source={{ uri: `${process.env.EXPO_PUBLIC_BASE_URL}/pet/${photo}` }}
					className='w-full min-h-[325px]'
				/>

				<View className='-mt-4 bg-white rounded-t-3xl px-5 pt-6 pb-10'>
					<Text className='text-3xl font-PoppinsSemiBold mb-2 text-center'>
						{name}
					</Text>
					<View className='w-full items-center justify-center mb-4 border border-white'>
						<View className='flex-row items-center'>
							<View className='items-center flex-1'>
								<Image source={icons.man} style={{ width: 24, height: 24 }} />
								<Text className='font-PoppinsRegular mt-2'>{gender}</Text>
							</View>
							<View className='items-center flex-1'>
								<Image
									source={icons.calendar}
									style={{ width: 24, height: 24 }}
								/>
								<Text className='font-PoppinsRegular mt-2'>{`${years}y ${months}m`}</Text>
							</View>
							<View className='items-center flex-1'>
								<Image
									source={icons.weight}
									style={{ width: 24, height: 24 }}
								/>
								<Text className='font-PoppinsRegular mt-2'>{weight} kg</Text>
							</View>
						</View>
					</View>

					{/* Описание питомца */}
					<Text className='text-xl font-PoppinsSemiBold mb-2'>About pet</Text>
					<Text className='text-base mb-4 font-PoppinsRegular'>
						{petDescription}
					</Text>

					{/* Характер (Personality) */}
					<Text className='text-xl font-PoppinsSemiBold mb-1'>Personality</Text>
					<View className='flex-row flex-wrap gap-2 mt-1 text-center'>
						{characterArray.length > 0 &&
							characterArray.map((item) => (
								<View
									key={item}
									className='flex-row items-center px-3 py-1 border-2 border-primary rounded-full'
								>
									<Image source={icons.paw} className='w-6 h-6 mr-1' />
									<Text className='text-lg font-PoppinsSemiBold text-primary'>
										{item}
									</Text>
								</View>
							))}
					</View>

					{/* Активности (Favorite Activities) */}
					<Text className='text-xl font-PoppinsSemiBold mb-1 mt-4'>
						Favorite Activities
					</Text>
					<View className='flex-row flex-wrap gap-1 mt-1'>
						{activityArray.length > 0 &&
							activityArray.map((item) => (
								<View
									key={item}
									className='flex-row items-center px-3 py-1 border-2 border-primary rounded-full'
								>
									<Image source={icons.paw} className='w-6 h-6 mr-1' />
									<Text className='text-lg font-PoppinsSemiBold text-primary'>
										{item}
									</Text>
								</View>
							))}
					</View>

					{/* Дополнительные примечания */}
					<Text className='text-xl font-PoppinsSemiBold mb-1 mt-4'>
						Additional Notes
					</Text>
					<Text className='text-base mb-4 font-PoppinsRegular'>
						{additionalNotes}
					</Text>
				</View>
			</ScrollView>

			{/* Нижняя кнопка меняется в зависимости от режима */}
			<View className='absolute bottom-5 left-0 right-0 items-center z-10'>
				{isEditMode ? (
					<Button
						title='Delete Pet 🗑️'
						size='lg'
						variant='danger'
						onPress={handleDelete}
					/>
				) : (
					<Button
						title='Share with sitter'
						size='lg'
						variant='primary'
						onPress={handleShare}
					/>
				)}
			</View>
		</View>
	);
};

export default PetProfileScreen;

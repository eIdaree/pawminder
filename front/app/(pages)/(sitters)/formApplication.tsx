import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
	ScrollView,
	Image
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/shared/Button';
import { useAuth } from '@/context/AuthContext';
import CollapsibleCheckboxGroup from '@/components/shared/CollapsibleCheckboxGroup/CollapsibleCheckboxGroup';
import RNPickerSelect from 'react-native-picker-select';
import { kazakhstanCities } from '@/constants/city';
import { tokenCache } from '@/utils/auth';
import { router } from 'expo-router';

interface FormData {
	description: string;
	location: string;
	petTypes: string[];
	skills: string[];
}

const FormApplication = () => {
	const { user, refreshUser } = useAuth();
	const [certificate, setCertificate] = useState<any>(null);
	const [photo, setPhoto] = useState<any>(null);
	const [selectedPetTypes, setSelectedPetTypes] = useState<string[]>([]);
	const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue
	} = useForm<FormData>();

	const handlePickCertificate = async () => {
		const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
		if (!result.canceled && result.assets.length > 0)
			setCertificate(result.assets[0]);
	};

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1
		});
		if (!result.canceled && result.assets.length > 0) {
			setPhoto(result.assets[0]);
		}
	};

	const onSubmit = async (data: FormData) => {
		if (!photo || !certificate) {
			Alert.alert('Error', 'Please upload both a photo and certificate');
			return;
		}

		try {
			const baseURL = process.env.EXPO_PUBLIC_BASE_URL;
			const userId = user.id;
			const token = await tokenCache.getToken('auth-token');
			const response = await fetch(`${baseURL}/users/${userId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...data,
					petTypes: selectedPetTypes,
					skills: selectedSkills,
					verificationStatus: 'pending'
				})
			});
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Form error: ${errorText || response.status}`);
			}

			const responseData = await response.json();
			if (!responseData) {
				throw new Error('No server response when updating profile.');
			}

			const photoForm = new FormData();
			photoForm.append('file', {
				uri: photo.uri,
				type: 'image/jpeg',
				name: photo.fileName || 'photo.jpg'
			} as any as Blob);
			const photoUpload = await fetch(`${baseURL}/upload/avatar/${userId}`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` },
				body: photoForm
			});

			if (!photoUpload.ok) {
				const photoError = await photoUpload.text();
				throw new Error(`Photo upload error: ${photoError}`);
			}

			const certForm = new FormData();
			certForm.append('file', {
				uri: certificate.uri,
				type: certificate.mimeType || 'application/pdf',
				name: certificate.name
			} as any);

			const certUpload = await fetch(
				`${baseURL}/upload/certificate/${userId}`,
				{
					method: 'POST',
					headers: { Authorization: `Bearer ${token}` },
					body: certForm
				}
			);

			if (!certUpload.ok) {
				const certError = await certUpload.text();
				throw new Error(`Certificate upload error: ${certError}`);
			}

			await refreshUser();
			Alert.alert(
				'Success',
				'Your application has been submitted for moderation'
			);
			router.replace('/(root)/(sitter-tabs)/profile');
		} catch (err: any) {
			console.error('onSubmit error:', err);
			Alert.alert('Error', err.message || 'Failed to submit the application');
		}
	};

	return (
		<ScrollView className='p-4'>
			<Text className='text-2xl font-bold mb-4'>Verification Form</Text>

			{/* Photo */}
			<Text className='mb-2 font-semibold'>Photo</Text>
			<Button
				title={photo?.fileName || 'Upload photo'}
				onPress={handlePickImage}
				variant='default'
			/>
			{photo?.uri && (
				<Image
					source={{ uri: photo.uri }}
					className='w-40 h-40 mt-2 rounded-xl'
				/>
			)}

			{/* Description */}
			<Text className='mt-4 mb-1'>About you</Text>
			<Controller
				control={control}
				name='description'
				rules={{ required: 'Description is required' }}
				render={({ field: { onChange, value } }) => (
					<TextInput
						className='border rounded p-2 mb-1'
						multiline
						numberOfLines={4}
						placeholder='Tell us briefly about yourself'
						value={value}
						onChangeText={onChange}
					/>
				)}
			/>
			{errors.description && (
				<Text className='text-red-500 mb-2'>{errors.description.message}</Text>
			)}

			{/* Animals */}
			<CollapsibleCheckboxGroup
				title='Which animals do you work with?'
				options={['Dogs', 'Cats']}
				selected={selectedPetTypes}
				onChange={(updated) => setSelectedPetTypes(updated)}
			/>

			<CollapsibleCheckboxGroup
				title='Your skills'
				options={['Walking', 'Training', 'Grooming', 'Medical Care']}
				selected={selectedSkills}
				onChange={(updated) => setSelectedSkills(updated)}
			/>

			{/* Location */}
			<Text className='mt-4 mb-1'>City</Text>
			<Controller
				control={control}
				name='location'
				rules={{ required: 'City is required' }}
				render={({ field: { onChange, value } }) => (
					<View className='border rounded mb-1 bg-white'>
						<RNPickerSelect
							onValueChange={(value) => onChange(value)}
							value={value}
							items={kazakhstanCities.map((city) => ({
								label: city,
								value: city
							}))}
						/>
					</View>
				)}
			/>
			{errors.location && (
				<Text className='text-red-500 mb-2'>{errors.location.message}</Text>
			)}

			{/* Certificate */}
			<Text className='mt-4 mb-2 font-semibold'>Certificate</Text>
			<Button
				title={certificate?.name || 'Upload certificate'}
				onPress={handlePickCertificate}
				variant='default'
			/>

			{user.verificationStatus === 'pending' && (
				<Text className='text-yellow-600 mt-2'>
					Your application is under review. You cannot submit again.
				</Text>
			)}

			{/* Submit */}
			<Button
				title='Submit application'
				onPress={handleSubmit(onSubmit)}
				variant='primary'
				size='lg'
				classes='mt-6'
				disabled={user.verificationStatus === 'pending'}
			/>
		</ScrollView>
	);
};

export default FormApplication;

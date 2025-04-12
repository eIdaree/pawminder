import { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/shared/Button';
import { tokenCache } from '@/utils/auth';
import { BackButton } from '@/components/shared/BackButton';

const NoteCreate = () => {
	const { petId } = useLocalSearchParams();
	const router = useRouter();

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');

	const baseURL = process.env.EXPO_PUBLIC_BASE_URL;

	const handleSave = async () => {
		if (!title.trim() || !content.trim()) {
			Alert.alert('Ошибка', 'Заполните все поля');
			return;
		}
		try {
			const token = await tokenCache.getToken('auth-token');
			const res = await fetch(`${baseURL}/notes/${petId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					title,
					content,
					petId: Number(petId)
				})
			});
			if (!res.ok) {
				console.log('Errorrr', res);
				throw new Error('Ошибка при сохранении');
			}

			Alert.alert('Успешно', 'Заметка добавлена');
			router.back(); // Вернуться к списку
		} catch (err: any) {
			console.error(err);
			Alert.alert('Ошибка', err.message);
		}
	};

	return (
		<>
			<BackButton />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				className='flex-1 bg-background px-4 pt-16'
			>
				<TextInput
					value={title}
					onChangeText={setTitle}
					placeholder='Title...'
					className='bg-background font-PoppinsSemiBold text-[32px] text-text rounded-xl  mb-4 '
				/>
				<TextInput
					value={content}
					onChangeText={setContent}
					placeholder='Write something...'
					multiline
					textAlignVertical='top'
					numberOfLines={10}
					className='border border-gray-300 bg-white rounded-xl p-3 text-base h-48'
				/>

				<View className='mt-6'>
					<Button title='Save Note' onPress={handleSave} variant='primary' />
				</View>
			</KeyboardAvoidingView>
		</>
	);
};

export default NoteCreate;

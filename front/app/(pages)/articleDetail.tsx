import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { BackButton } from '@/components/shared/BackButton';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { router } from 'expo-router';
import { Button } from '@/components/shared/Button';

type ArticleParams = {
	params: {
		id?: number;
		title: string;
		subtitle: string;
		author: string;
		date: string;
		imageUrl: string;
		content?: string;
	};
};

const ArticleDetailScreen = () => {
	const route = useRoute<RouteProp<ArticleParams, 'params'>>();
	const navigation = useNavigation();
	const { id, title, subtitle, author, date, imageUrl, content } =
		route.params || {};

	// Если полного текста нет, берем subtitle в качестве preview
	const articleContent = content || subtitle;
	const [isEditMode, setIsEditMode] = useState(false);

	// Функция для генерации PDF и его шаринга
	const handleShare = async () => {
		try {
			// Формируем HTML с данными статьи
			const html = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 16px;">
            <h1>${title}</h1>
            <h2>${subtitle}</h2>
            <p><strong>By:</strong> ${author} · <strong>Date:</strong> ${date}</p>
            <p>${articleContent}</p>
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
				dialogTitle: 'Share Article',
				UTI: 'com.adobe.pdf'
			});
		} catch (error) {
			console.error('Error sharing PDF', error);
			Alert.alert('Error', 'There was an error generating or sharing the PDF.');
		}
	};

	// Функция удаления статьи с подтверждением
	const handleDelete = async () => {
		Alert.alert(
			'Delete Article',
			'Are you sure you want to delete this article?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						try {
							// Здесь необходимо вызвать API для удаления статьи:
							await fetch(
								`${process.env.EXPO_PUBLIC_BASE_URL}/articles/${id}`,
								{
									method: 'DELETE'
								}
							);
							Alert.alert('Article deleted');
							router.back();
							navigation.goBack();
						} catch (error) {
							console.error('Delete article failed', error);
							Alert.alert('Error', 'Failed to delete article.');
						}
					}
				}
			]
		);
	};

	return (
		<View className='flex-1 bg-white'>
			{/* Кнопка-карандаш для переключения режима */}
			<Pressable
				onPress={() => setIsEditMode(!isEditMode)}
				className='absolute top-5 right-5 z-20 bg-black/20 p-2 rounded-full'
			>
				<Text className='text-xl'>✏️</Text>
			</Pressable>

			{/* Кнопка назад */}
			<BackButton />

			<ScrollView className='flex-1'>
				<Image source={imageUrl} className='w-full h-72' />

				<View className='p-4'>
					<Text className='text-center text-3xl font-semibold mb-2'>
						{title}
					</Text>
					<Text className='text-center text-lg text-gray-500 mb-1'>
						{subtitle}
					</Text>
					<Text className='text-center text-sm text-gray-500 mb-4'>{`By ${author} · ${date}`}</Text>
					<Text className='text-base leading-6'>{articleContent}</Text>
				</View>
			</ScrollView>

			{/* Нижняя кнопка, меняющаяся в зависимости от режима */}
			<View className='absolute bottom-5 left-0 right-0 items-center'>
				{isEditMode ? (
					<Button
						title='Delete Article 🗑️'
						onPress={handleDelete}
						variant='danger'
					/>
				) : (
					<Button
						title='Share Article'
						onPress={handleShare}
						variant='primary'
					/>
				)}
			</View>
		</View>
	);
};

export default ArticleDetailScreen;

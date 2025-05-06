import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { BackButton } from '@/components/shared/BackButton';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { router } from 'expo-router';
import { Button } from '@/components/shared/Button';
type ContentBlock = {
	header: string;
	text: string;
};
type ArticleParams = {
	params: {
		id?: number;
		title: string;
		subtitle: string;
		author: string;
		date: string;
		imageUrl: string;
		content: string;
	};
};

const ArticleDetailScreen = () => {
	const route = useRoute<RouteProp<ArticleParams, 'params'>>();
	const navigation = useNavigation();
	const {
		id,
		title,
		subtitle,
		author,
		date,
		imageUrl,
		content = []
	} = route.params || {};
	console.log('route.params', route.params);
	// console.log('content', JSON.parse(content));
	// Если полного текста нет, берем subtitle в качестве preview
	const articleContent: ContentBlock[] = content
		? JSON.parse(content)
		: [{ header: 'Preview', text: 'fffff' }];
	const [isEditMode, setIsEditMode] = useState(false);

	// Функция для генерации PDF и его шаринга
	const handleShare = async () => {
		try {
			// Generate HTML with improved styling
			const contentHtml = articleContent
				.map(
					(block) => `
			  <div class="content-block">
				<h3 class="content-header">${block.header}</h3>
				<p class="content-text">${block.text}</p>
			  </div>
			`
				)
				.join('');

			const html = `
			<html>
			  <head>
				<style>
				  body {
					font-family: 'Helvetica Neue', Arial, sans-serif;
					line-height: 1.6;
					color: #333;
					max-width: 800px;
					margin: 0 auto;
					padding: 20px;
				  }
				  .article-header {
					text-align: center;
					margin-bottom: 30px;
					border-bottom: 2px solid #f0f0f0;
					padding-bottom: 20px;
				  }
				  h1 {
					color: #2c3e50;
					font-size: 28px;
					margin-bottom: 10px;
				  }
				  h2 {
					color: #7f8c8d;
					font-size: 20px;
					font-weight: normal;
					margin-bottom: 15px;
				  }
				  .meta {
					color: #95a5a6;
					font-size: 14px;
					margin-bottom: 20px;
				  }
				  .content-block {
					margin-bottom: 25px;
				  }
				  .content-header {
					color: #3498db;
					font-size: 20px;
					margin: 25px 0 10px 0;
					padding-bottom: 5px;
					border-bottom: 1px solid #eee;
				  }
				  .content-text {
					font-size: 16px;
					margin: 0 0 15px 0;
					text-align: justify;
				  }
				  @media print {
					body {
					  padding: 0;
					}
					.article-header {
					  page-break-after: avoid;
					}
					.content-block {
					  page-break-inside: avoid;
					}
				  }
				</style>
			  </head>
			  <body>
				<div class="article-header">
				  <h1>${title}</h1>
				  <h2>${subtitle}</h2>
				  <div class="meta">
					By ${author} · Published on ${date}
				  </div>
				</div>
				${contentHtml}
			  </body>
			</html>
		  `;

			const { uri } = await Print.printToFileAsync({
				html,
				width: 612, // US Letter width in points (8.5in)
				height: 792 // US Letter height in points (11in)
			});

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
					{articleContent.map((block, index) => (
						<View key={index} className='mb-4 border-lightgray border-t mt-4'>
							<Text className='text-xl font-bold mb-2 mt-2'>
								{block.header}
							</Text>
							<Text className='text-base leading-6'>{block.text}</Text>
						</View>
					))}
				</View>
			</ScrollView>

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

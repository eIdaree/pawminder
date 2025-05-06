import React from 'react';
import { View, Text, Image, Linking, Alert } from 'react-native';
import { Sitter } from '@/types/types';
import { Button } from './shared/Button';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { icons } from '@/constants';
import { toParams } from '@/utils/toParams';

const handleContactPress = (phone: string) => {
	Alert.alert(
		'Связаться с няней',
		`Выберите способ связи с номером ${phone}`,
		[
			{ text: 'Отмена', style: 'cancel' },
			{
				text: 'Позвонить',
				onPress: () => Linking.openURL(`tel:${phone}`)
			},
			{
				text: 'WhatsApp',
				onPress: () => {
					const url = `https://wa.me/${phone.replace('+', '')}`;
					Linking.openURL(url).catch(() =>
						Alert.alert('Ошибка', 'Не удалось открыть WhatsApp')
					);
				}
			}
		],
		{ cancelable: true }
	);
};

const SitterCard = ({
	sitter,
	hideActions
}: {
	sitter: Sitter;
	hideActions?: boolean;
}) => {
	return (
		<View className='mb-8 pt-1 pb-2 pr-3 pl-2 bg-white rounded-2xl border border-background shadow-md flex flex-row gap-4 min-h-[175px] '>
			<View>
				<Image
					source={{
						uri: `${process.env.EXPO_PUBLIC_BASE_URL}/avatars/${sitter.avatarUrl}`
					}}
					className='w-[122px] h-[151px] rounded-lg'
				></Image>
			</View>
			<View>
				<Text className='font-bold text-xl family-PoppinsSemiBold'>
					{sitter.first_name} {sitter.last_name}
				</Text>
				<View className='flex-row items-center px-2 py-1 border-2 border-primary rounded-full self-start my-1'>
					<Text className='text-xs text-primary font-PoppinsMedium'>
						{sitter.level}
					</Text>
				</View>

				<Text className='text-xs font-PoppinsRegular mt-3'>Work with:</Text>
				<View className='flex-row flex-wrap gap-2 mt-1 text-center'>
					{sitter.petTypes?.map((type) => (
						<View
							key={type}
							className='flex flex-row items-center px-2 py-1 border-2 border-primary rounded-full'
						>
							<Image source={icons.paw} className='w-4 h-4 mr-1' />
							<Text className='text-xs text-primary font-PoppinsSemiBold'>
								{type}
							</Text>
						</View>
					))}
				</View>
				<View className='flex-row flex-wrap gap-1 mt-1'>
					{sitter.skills?.map((skill) => (
						<Text key={skill} className='text-sm text-darkgray'>
							{skill}
						</Text>
					))}
				</View>
				{!hideActions && (
					<View className='flex-row mt-3 items-center'>
						<Button
							size='md'
							title='About me'
							variant='primary'
							onPress={() =>
								router.push({
									pathname: '/(pages)/(sitters)/sitterProfile',
									params: toParams(sitter)
								})
							}
						></Button>
						<Pressable
							className='ml-4'
							onPress={() => handleContactPress(sitter.phone)}
						>
							<Image source={icons.chat} className='w-[24px] h-[24px]' />
						</Pressable>
					</View>
				)}
			</View>
		</View>
	);
};

export default SitterCard;

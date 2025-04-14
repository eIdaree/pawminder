import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/shared/Button';
import { icons } from '@/constants';
import { BackButton } from '@/components/shared/BackButton';
import { Review } from '@/types/types';
import { StarRating } from '@/components/shared/StarRating/StarRating';

const SitterProfile = () => {
	const sitter = useLocalSearchParams();
	const petTypes = sitter.petTypes?.split(',') || [];
	const skills = sitter.skills?.split(',') || [];
	const [reviews, setReviews] = useState<Review[]>([]);

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const res = await fetch(
					`${process.env.EXPO_PUBLIC_BASE_URL}/orders/reviews/${sitter.id}`
				);
				const data = await res.json();
				setReviews(data);
			} catch (err) {
				console.error('Ошибка при загрузке отзывов', err);
			}
		};
		fetchReviews();
	}, []);

	console.log('SitterProfile', { sitter });
	return (
		<View className='flex-1 bg-white'>
			<BackButton />

			<ScrollView className='flex-1'>
				<Image
					source={{
						uri: `${process.env.EXPO_PUBLIC_BASE_URL}/avatars/${sitter.avatarUrl}`
					}}
					className='w-full min-h-[325px]'
				/>

				<View className='-mt-4 bg-white rounded-t-3xl px-5 pt-6 pb-10'>
					<Text className='text-3xl font-PoppinsSemiBold mb-2 text-center'>
						{sitter.first_name} {sitter.last_name}
					</Text>
					<View className='w-full items-center justify-center mb-4 border border-white'>
						<View className='flex-row items-center gap-1'>
							<Image source={icons.point} className='w-4 h-4' />
							<Text className='text-gray-600 text-base font-PoppinsRegular'>
								{sitter.location + ', Kazakhstan'}
							</Text>
						</View>
					</View>
					<Text className='text-xl font-PoppinsSemiBold mb-1'>Titul</Text>
					<Text className='text-base mb-4 mt-2 py-2 px-3 max-w-[127px] text-white text-center font-PoppinsSemiBold bg-primary rounded-full'>
						{sitter.level}
					</Text>

					<Text className='text-xl font-PoppinsSemiBold mb-2'>About me</Text>
					<Text className='text-base mb-4 font-PoppinsRegular'>
						{sitter.description}
					</Text>

					<Text className='text-xl font-PoppinsSemiBold mb-1'>Work with</Text>
					<View className='flex-row flex-wrap gap-2 mt-1 text-center'>
						{petTypes.map((type) => (
							<View
								key={type}
								className='flex-row items-center px-3 py-1 border-2 border-primary rounded-full'
							>
								<Image source={icons.paw} className='w-6 h-6 mr-1' />
								<Text className='text-lg font-PoppinsSemiBold text-primary'>
									{type}
								</Text>
							</View>
						))}
					</View>

					<Text className='text-xl font-PoppinsSemiBold mb-1 mt-4'>Skills</Text>
					<View className='flex-row flex-wrap gap-1 mt-1'>
						{skills.map((skill) => (
							<Text key={skill} className='text-base text-darkgray'>
								{skill}
							</Text>
						))}
					</View>
					{reviews.length > 0 && (
						<View className='mt-6'>
							<Text className='text-xl font-PoppinsSemiBold mb-2'>Reviews</Text>
							<View className='flex flex-row items-center py-4 px-8 justify-center my-3 border rounded-xl border-lightgray'>
								<StarRating rating={Number(sitter.averageRating)} />
								<Text className='text-base font-PoppinsMedium mr-[7px]'>
									{sitter.averageRating}
								</Text>
								<Text className='text-sm font-PoppinsRegular '>
									{reviews.length} reviews
								</Text>
							</View>
							{reviews.map((review) => (
								<View
									key={review.id}
									className='mb-3 p-3 bg-gray-100 rounded-xl'
								>
									<Text className='font-PoppinsMedium text-sm mb-1'>
										{review.user.first_name} {review.user.last_name}
									</Text>
									<Text className='text-yellow-500 text-sm mb-1'>
										{'★'.repeat(review.rating)}
										{'☆'.repeat(5 - review.rating)}
									</Text>
									<Text className='text-base text-darkgray'>
										{review.review}
									</Text>
								</View>
							))}
						</View>
					)}
				</View>
			</ScrollView>
			<View className='absolute bottom-5 left-0 right-0 items-center z-10'>
				<Button
					title='Apply Now'
					size='lg'
					variant='primary'
					onPress={() =>
						router.push({
							pathname: '/(pages)/(orders)/orderForm',
							params: sitter
						})
					}
				/>
			</View>
		</View>
	);
};

export default SitterProfile;

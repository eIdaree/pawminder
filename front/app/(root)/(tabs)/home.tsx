import React from 'react';
import {
	View,
	Text,
	ScrollView,
	ActivityIndicator,
	Button,
	Alert,
	Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/Layout/Header';
import FeatureButton from '@/components/FeatureButton';
import ArticleCard from '@/components/ArticleCard';
import { images } from '@/constants/index';
import { useAuth } from '@/context/AuthContext';
import { articles } from '@/constants/articles';

const Home: React.FC = () => {
	const router = useRouter();
	const { user, logout, isLoading } = useAuth();
	if (isLoading) {
		return <ActivityIndicator size='large' />;
	}

	if (!user) {
		return (
			<View className='flex-1 justify-center items-center bg-white'>
				<Text className='text-red-500 text-lg mb-4'>
					Unable to load user data. Please log in again.
				</Text>
				<Button title='Log Out' onPress={logout} />
			</View>
		);
	}

	const features = [
		{
			title: 'Pet Sitters',
			icon: images.sitters,
			route: '/(root)/(tabs)/sitters',
			color: '#674CFF'
		},
		{ title: 'Map', icon: images.map, route: '/(pages)/map', color: '#8A75FF' }
		// { title: "Special Offer", icon: images.special, route: "/(pages)/specialoffer", color: "#8A75FF" },
		// { title: "Pet Store", icon: images.petstore, route: "/(tabs)/shop", color: "#674CFF" },
	];

	return (
		<ScrollView
			className='flex-1 bg-background p-4 pt-16'
			contentContainerStyle={{ paddingBottom: 60 }}
		>
			<Text className='text-2xl mb-2 font-PoppinsMedium'>
				Welcome {user.first_name || 'User'}!
			</Text>
			<Text className='text-gray-500 mb-6'>
				Everything your pet needs, all in one place.
			</Text>

			<View className='flex-row flex-wrap justify-between mb-6 w-full'>
				{features.map((feature, index) => (
					<FeatureButton
						key={index}
						title={feature.title}
						icon={feature.icon}
						onPress={() => router.push(feature.route as any)}
						color={feature.color}
					/>
				))}
			</View>

			<Text className='text-xl font-bold mb-4'>Articles</Text>
			<View className='min-w-[330px] w-full'>
				{articles.map((article) => (
					<Pressable
						key={article.id}
						onPress={() =>
							router.push({
								pathname: '/articleDetail',
								params: { ...article }
							})
						}
					>
						<ArticleCard
							title={article.title}
							author={article.author}
							date={article.date}
							imageUrl={article.imageUrl}
						/>
					</Pressable>
				))}
			</View>
		</ScrollView>
	);
};

export default Home;

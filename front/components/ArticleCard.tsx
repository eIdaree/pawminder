import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';

type ArticleCardProps = {
	title: string;
	author: string;
	date: string;
	imageUrl: ImageSourcePropType;
};

const ArticleCard: React.FC<ArticleCardProps> = ({
	title,
	author,
	date,
	imageUrl
}) => {
	return (
		<View className='bg-white rounded-2xl p-4 my-1 w-full'>
			<View className='flex-row items-center justify-around gap-4'>
				<Image source={imageUrl} className='w-[142px] h-[117px] rounded-lg' />
				<View className='flex-1'>
					<Text
						className='text-xl font-PoppinsMedium text-black'
						style={{ flexWrap: 'wrap' }}
						numberOfLines={2}
					>
						{title}
					</Text>
					<Text
						className='text-sm font-PoppinsRegular text-gray-500'
						style={{ flexWrap: 'wrap' }}
						numberOfLines={1}
					>
						{`Author ${author} · ${date}`}
					</Text>
				</View>
			</View>
		</View>
	);
};

export default ArticleCard;

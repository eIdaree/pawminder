import React from 'react';
import {
	Text,
	TouchableOpacity,
	Image,
	ImageSourcePropType,
	View
} from 'react-native';

type FeatureButtonProps = {
	title: string;
	icon?: ImageSourcePropType;
	onPress: () => void;
	color: string;
};

const FeatureButton: React.FC<FeatureButtonProps> = ({
	title,
	icon,
	onPress,
	color
}) => {
	return (
		<TouchableOpacity
			style={{ backgroundColor: color }}
			className='w-[49%] min-h-[160px] rounded-3xl px-4 pt-4 mb-4 flex flex-col justify-between'
			onPress={onPress}
		>
			<Text className='text-xl text-white font-PoppinsSemiBold'>{title}</Text>

			<View className='flex-1 justify-end'>
				<Text> </Text>
				{/* New container for the image */}
				<Image source={icon} className='w-full h-28 object-contain' />
			</View>
		</TouchableOpacity>
	);
};

export default FeatureButton;

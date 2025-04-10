import React from 'react';
import {
	Text,
	TouchableOpacity,
	Image,
	ImageSourcePropType
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
			className='w-[48%] rounded-xl px-4 pt-4 mb-4'
			onPress={onPress}
		>
			<Text className='text-xl font-bold mb-4 text-white font-PoppinsRegular '>
				{title}
			</Text>

			<Image
				source={icon}
				style={{
					position: 'relative',
					bottom: 0,
					left: -10,
					width: '120%',
					height: 100,
					resizeMode: 'contain'
				}}
			/>
		</TouchableOpacity>
	);
};

export default FeatureButton;

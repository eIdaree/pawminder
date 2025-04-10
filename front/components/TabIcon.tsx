import { View, Image, Text } from 'react-native';

export const TabIcon = ({
	source,
	label,
	focused
}: {
	source: any;
	label: string;
	focused: boolean;
}) => (
	<View className='flex items-center justify-space-around w-20'>
		<View className={`items-center justify-center mt-6`}>
			<Image
				source={source}
				style={{
					width: 30,
					height: 24,
					tintColor: focused ? '#674CFF' : 'black'
				}}
				resizeMode='contain'
			/>
		</View>
		<Text
			className={`mt-2 text-xs w-16 text-center font-PoppinsRegular ${
				focused ? 'text-primary' : 'text-gray-500'
			}`}
			numberOfLines={1}
		>
			{label}
		</Text>
	</View>
);

import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export const BackButton = () => {
	return (
		<TouchableOpacity
			onPress={() => router.back()}
			className='absolute top-5 left-3 z-20 bg-white/80 p-2 rounded-full'
		>
			<Feather name='arrow-left' size={24} color='black' />
		</TouchableOpacity>
	);
};

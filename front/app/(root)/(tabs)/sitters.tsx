import React from 'react';
import { View, SafeAreaView } from 'react-native';
import SitterCatalog from '../../(pages)/(sitters)/sitterCatalog';

const SittersPage = () => {
	return (
		<SafeAreaView className='flex-1 bg-background'>
			<View className='flex-1'>
				<SitterCatalog />
			</View>
		</SafeAreaView>
	);
};

export default SittersPage;

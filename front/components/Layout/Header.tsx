import React from 'react';
import { View, Text, Image } from 'react-native';

const Header: React.FC = () => {
  return (
    <View className="flex-row justify-between items-center mb-4">
      <Text className="text-gray-500">📍 Almaty, Kazakhstan</Text>
      <Image
        source={require('@/assets/images/dogimage.png')} 
        className="w-12 h-12 rounded-full"
      />
    </View>
  );
};

export default Header;

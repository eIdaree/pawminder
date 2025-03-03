import { View, Image, Dimensions } from 'react-native';
import shoppng from '@/assets/images/Chat2.png';

const shop = () => {
  const screenHeight = Dimensions.get('window').height;
  return (
    <View className="flex-1">
      <Image
        source={shoppng}
        className="w-full h-full"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: screenHeight * 0.9, 
        }}
        resizeMode="cover"
      />
    </View>
  )
}

export default shop

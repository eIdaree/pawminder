import { View, Text, Image, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PetFormState } from '@/types/types';

type RouteParams = {
  params: PetFormState;
};

const PetProfileScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const { name, type, breed, photo } = route.params || {};

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        {photo ? (
          <Image
            source={{ uri: photo }}
            className="w-full h-64 rounded-2xl"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-64 bg-gray-300 rounded-2xl justify-center items-center">
            <Text className="text-gray-500">Нет фото</Text>
          </View>
        )}

        <Text className="text-2xl font-bold mt-4">{name || 'Без имени'}</Text>
        <Text className="text-lg text-gray-500">
          {type && breed ? `${type} - ${breed}` : 'Тип и порода неизвестны'}
        </Text>
        <Text className="text-lg text-gray-500">Возраст: {'Неизвестно'}</Text>

        
          <Text className="mt-4 text-base text-gray-400">Описание отсутствует</Text>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default PetProfileScreen;

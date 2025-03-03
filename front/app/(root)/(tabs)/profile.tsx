import { View, Text, TouchableOpacity } from 'react-native'; // Используем TouchableOpacity
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

const Profile = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      logout(); 
      router.replace('/sign-in'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View className="bg-gray-100 px-4 py-8 items-start flex-column">
      {/* Картинка животного */}
      <Text className='text-3xl font-PoppinsSemiBold text-bold'>Welcome {user.first_name}</Text>
      <Text className='text-xl font-PoppinsSemiBold '>How are you doing?</Text>

      {/* Текст */}
      <View className='mt-16'>
        <Text className="text-lg font-bold text-left">Email</Text>
        <Text className="text-sm  mb-4 text-left">
          {user.email}
        </Text>
        <Text className="text-lg font-bold text-left">Phone Number</Text>
        <Text className="text-sm ">{user.phone}</Text>
      </View>

      {/* Кнопка выхода с кастомным стилем */}
      <TouchableOpacity
        
        className='mt-8 bg-red-500 h-12 px-4 py-2 rounded-lg w-full '  
        onPress={handleLogout}
      >
        <Text className='text-center text-white text-lg text-bold font-PoppinsSemiBold'>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

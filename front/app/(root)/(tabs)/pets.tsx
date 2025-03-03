import { View, Text, Image, Button, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { icons } from '@/constants';
import FeatureButton from '@/components/FeatureButton';
import { Link, useRouter } from 'expo-router';
import { tokenCache } from '@/utils/auth';
import { useAuth } from '@/context/AuthContext';
import { fetchPetData } from '@/services/api';


const calculateAge = (dateOfBirth: string) => {
  if (!dateOfBirth) {
    console.error("date_of_birth is undefined");
    return { years: 0, months: 0 };
  }
  const birthDate = new Date(dateOfBirth);
  const currentDate = new Date();
  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months };
};

const Pets = () => {
  const router = useRouter();
  const [petData, setPetData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Guard clause if user data is missing
  if (!user) {
    return <Text>You are not authorized to view this page.</Text>;
  }

  // Fetch pet data only if user is available
  useEffect(() => {
    let isMounted = true;

    const fetchPets = async () => {
      const userId = user.id;
      if (userId) {
        try {
          const token = await tokenCache.getToken('auth-token');
          if (token) {
            const data = await fetchPetData(token, userId);
            if (isMounted) {
              setPetData(data);
            }
          }
        } catch (error) {
          console.error('Error fetching pet data:', error);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else if (isMounted) {
        setIsLoading(false);
      }
    };

    fetchPets();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Loading state
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // No pet data
  if (!petData || petData.length === 0) {
    return (
      <View className='flex-1 items-center justify-center w-4/5  bg-cyan-100 mx-auto'>
        <Text className='text-lg'>You don't have any pets</Text>
        <Pressable onPress={() => router.push('/(pages)/(pets)/addpet')}>
        <Text className='text-white text-center text-xl w-full bg-cyan-500 rounded-2xl p-4 mt-2'>
          Add a pet
        </Text>
      </Pressable>
      </View>
    );
  }

  // Safe extraction of age data
  const { years, months } = petData && petData.length > 0
    ? calculateAge(petData[0]?.date_of_birth)
    : { years: 0, months: 0 };

  const features = [
    { title: 'Calendar', route: '/(pages)/petsitters', color: '#674CFF' },
    { title: 'To-do', route: '/(pages)/todo', color: '#8A75FF' },
    // { title: 'Notes', route: '/(pages)/specialoffer', color: '#8A75FF' },
    // { title: 'Photos', route: '/(tabs)/shop', color: '#674CFF' },
  ];

  return (
    <View className="bg-gray-100 px-4 py-8">
      {/* Pet Image */}
      <View className="items-center mb-4">
        <Image
          source={require('@/assets/images/card.png')}
          className="h-32 w-full rounded-3xl"
          resizeMode="cover"
        />
      </View>

      {/* Pet Name and Age */}
      <Text className="text-xl font-bold text-center">{petData[0]?.name || 'Unknown Pet'}</Text>
      <Text className="text-sm text-center mb-4">
        {years > 0
          ? `${years} year${years > 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`
          : `${months} month${months !== 1 ? 's' : ''}`}
      </Text>

      {/* Pet Info */}
      <View className="flex-row my-3 mx-auto justify-between w-2/5">
        <View className="items-center">
          <Image source={icons.calendar} style={{ width: 20, height: 20 }} />
          <Text className="font-PoppinsRegular mt-2">
            {years > 0 ? `${years} year${years > 1 ? 's' : ''}` : `${months} month${months !== 1 ? 's' : ''}`}
          </Text>
        </View>
        <View className="items-center">
          <Image source={icons.weight} style={{ width: 20, height: 20 }} />
          <Text className="font-PoppinsRegular mt-2">{petData[0]?.weight || 'Unknown'} kg</Text>
        </View>
      </View>

      {/* Feature Buttons */}
      <View className="flex-row flex-wrap justify-between">
        {features.map((feature, index) => (
          <FeatureButton
            key={index}
            title={feature.title}
            onPress={() => router.push(feature.route as any)}
            color={feature.color}
          />
        ))}
      </View>
    </View>
  );
};

export default Pets;

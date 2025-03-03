import { Stack } from 'expo-router';
import React from 'react'
import { Text, View } from 'react-native'

function addpet() {
  return (
    <>
    {/* <Stack.Screen
        options={{
          title: "Add a pet",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      /> */}
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg">Add your pet details here</Text>
    </View>
  </>
  )
}

export default addpet;
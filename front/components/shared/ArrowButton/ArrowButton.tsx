import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface ArrowButtonProps {
  direction: 'left' | 'right';
  onPress: () => void;
}

export const ArrowButton: React.FC<ArrowButtonProps> = ({ direction, onPress }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: pressed ? '#4F46E5' : '#6366F1',
        backgroundColor: pressed ? '#4F46E5' : 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Контейнер для стрелки */}
      <View
        style={{
          width: 16,
          height: 16,
          transform: [{ rotate: direction === 'right' ? '0deg' : '180deg' }],
        }}
      >
        {/* Горизонтальная линия стрелки */}
        <View
          style={{
            position: 'absolute',
            width: 16,
            height: 2,
            backgroundColor: pressed ? 'white' : '#6366F1',
            top: 7,
          }}
        />
        {/* Диагональная линия стрелки (верхний угол) */}
        <View
          style={{
            position: 'absolute',
            width: 8,
            height: 2,
            backgroundColor: pressed ? 'white' : '#6366F1',
            transform: [{ rotate: '45deg' }],
            top: 3,
            left: 8,
          }}
        />
        {/* Диагональная линия стрелки (нижний угол) */}
        <View
          style={{
            position: 'absolute',
            width: 8,
            height: 2,
            backgroundColor: pressed ? 'white' : '#6366F1',
            transform: [{ rotate: '-45deg' }],
            top: 11,
            left: 8,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

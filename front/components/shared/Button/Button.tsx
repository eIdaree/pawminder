import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { classNames } from '@/shared/helpers/classNames';
import { IconType } from 'react-icons';

interface ButtonProps{
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled? : boolean;
    className?: string;
    children?: React.ReactNode;
    isLoading?: boolean;
    size?: 'sm' | 'md' | 'lg';
    icon?: IconType;
    iconPosition?: 'left' | 'right';
}

const sizes = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg'
}

const variants = {
    primary: 'bg-blue-500',
    secondary: 'bg-white-500',
    danger: 'bg-red-500',
};

const Button: React.FC<ButtonProps> = ({
    className,
    children, 
    onPress, 
    title, 
    variant = 'primary',
    disabled = false,
    isLoading = false,
    size = 'md',
    icon: Icon,
    iconPosition = 'left'
}) => {
    return(
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || isLoading}
            className={classNames(
                'rounded flex-row items-center justify-center',
                {'opacity-50': disabled || isLoading},
                [variants[variant], sizes[size], className]
            )}
        >
            <View className='flex-row items-center'>
                {isLoading ? (
                    <ActivityIndicator color='white'/>
                ) : (
                    <>
                        {Icon && iconPosition ==='left' && <Icon className='mr-2'/>}
                        <Text className='text-white text-center font-bold'>{title}</Text>
                        {Icon && iconPosition ==='right' && <Icon className='ml-2'/>}
                        {children}
                    </>
                )}
            </View>
        </TouchableOpacity>
    )
}

export default Button
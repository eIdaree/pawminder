import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { classNames } from '@/shared/helpers/classNames';
import { IconType } from 'react-icons';

interface ButtonProps {
	onPress: () => void;
	title?: string;
	variant?: 'primary' | 'secondary' | 'danger' | 'default';
	disabled?: boolean;
	classes?: string;
	children?: React.ReactNode;
	isLoading?: boolean;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	icon?: IconType;
	iconPosition?: 'left' | 'right';
}

const sizes = {
	sm: 'p-2 text-sm w-[99px] h-[27px]',
	md: 'p-1 text-base min-w-[130px] min-h-[36px]',
	lg: 'py-3 px-10 text-lg ',
	xl: 'w-[328px] h-[64px] text-xl '
};

const variants = {
	primary: 'bg-primary',
	secondary: 'bg-white-500',
	danger: 'bg-red-500',
	default: 'bg-white border border-black'
};

const Button: React.FC<ButtonProps> = ({
	classes,
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
	const textColor = {
		default: 'text-black',
		primary: 'text-white',
		secondary: 'text-white',
		danger: 'text-red-500'
	}[variant];
	const textSize = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg',
		xl: 'text-xl '
	}[size];

	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled || isLoading}
			className={classNames(`rounded-3xl flex-row items-center justify-center 
                ${variants[variant]} ${sizes[size]} 
                ${disabled || isLoading ? 'opacity-50' : ''} 
                ${classes || ''}`)}
		>
			<View className='flex-row items-center'>
				{isLoading ? (
					<ActivityIndicator color='white' />
				) : (
					<>
						{Icon && iconPosition === 'left' && <Icon className='mr-2' />}
						{title && (
							<Text
								className={`${textColor} ${textSize} text-center font-PoppinsSemiBold`}
							>
								{title}
							</Text>
						)}
						{Icon && iconPosition === 'right' && <Icon className='ml-2' />}
						{!title && children}
					</>
				)}
			</View>
		</TouchableOpacity>
	);
};

export default Button;

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CheckboxProps {
	label: string;
	checked: boolean;
	onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
	return (
		<TouchableOpacity
			className={`flex-row items-center mb-2 mr-4 px-3 py-2 rounded-full border ${
				checked ? 'bg-primary border-primary' : 'border-gray-400 bg-white'
			}`}
			onPress={onChange}
			activeOpacity={0.8}
		>
			<View
				className={`w-4 h-4 rounded-sm mr-2 border ${
					checked ? 'bg-white border-white' : 'bg-white'
				}`}
			>
				{checked && (
					<View className='w-4 h-4 rounded-sm bg-primary border border-white' />
				)}
			</View>
			<Text
				className={`${
					checked ? 'text-white' : 'text-black'
				} text-sm font-medium`}
			>
				{label}
			</Text>
		</TouchableOpacity>
	);
};

export default Checkbox;

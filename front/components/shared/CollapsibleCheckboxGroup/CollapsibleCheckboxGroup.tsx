import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Checkbox } from '@/components/shared/Checkbox';

interface Props {
	title: string;
	options: string[];
	selected: string[];
	onChange: (updated: string[]) => void;
}

const CollapsibleCheckboxGroup: React.FC<Props> = ({
	title,
	options,
	selected,
	onChange
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleOption = (option: string) => {
		const updated = selected.includes(option)
			? selected.filter((item) => item !== option)
			: [...selected, option];
		onChange(updated);
	};

	return (
		<View className='mb-4'>
			<TouchableOpacity
				onPress={() => setIsOpen(!isOpen)}
				className='py-3 px-4 bg-white border rounded-xl border-gray-300'
			>
				<Text className='text-base font-medium text-black'>
					{selected.length > 0 ? selected.join(', ') : title}
				</Text>
			</TouchableOpacity>

			{isOpen && (
				<View className='flex flex-wrap mt-3 px-1'>
					{options.map((option) => (
						<Checkbox
							key={option}
							label={option}
							checked={selected.includes(option)}
							onChange={() => toggleOption(option)}
						/>
					))}
				</View>
			)}
		</View>
	);
};

export default CollapsibleCheckboxGroup;

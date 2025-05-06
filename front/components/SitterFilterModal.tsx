import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { kazakhstanCities } from '@/constants/city';
import { Button } from './shared/Button';

const skillsOptions = ['Walking', 'Training', 'Grooming', 'Medical Care'];
const petTypesOptions = ['Dogs', 'Cats'];

const SitterFilterModal = ({ visible, onClose, onApply }) => {
	const [screen, setScreen] = useState<'main' | 'city' | 'skills' | 'petTypes'>(
		'main'
	);
	const [selectedCity, setSelectedCity] = useState('');
	const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
	const [selectedPetTypes, setSelectedPetTypes] = useState<string[]>([]);

	const toggleSelection = (
		arr: string[],
		value: string,
		setFn: any,
		isSingleSelect = false
	) => {
		if (isSingleSelect) {
			setFn(value);
		} else {
			if (arr.includes(value)) {
				setFn(arr.filter((item) => item !== value));
			} else {
				setFn([...arr, value]);
			}
		}
	};

	const renderMain = () => (
		<View>
			<View className='flex flex-row items-center justify-between mb-4'>
				<Text className='text-xl font-bold flex-1' numberOfLines={1}>
					Filters
				</Text>
				<TouchableOpacity
					onPress={() => {
						setSelectedCity('');
						setSelectedSkills([]);
						setSelectedPetTypes([]);
					}}
					className='px-3 py-1 border border-red-500 rounded-full'
				>
					<Text className='text-red-500 text-sm font-medium'>Reset</Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity
				className='p-4 border border-gray-300 rounded-xl mb-3'
				onPress={() => setScreen('city')}
			>
				<Text>City: {selectedCity || 'Not selected'}</Text>
			</TouchableOpacity>

			<TouchableOpacity
				className='p-4 border border-gray-300 rounded-xl mb-3'
				onPress={() => setScreen('skills')}
			>
				<Text>
					Skills:{' '}
					{selectedSkills.length ? selectedSkills.join(', ') : 'Not selected'}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				className='p-4 border border-gray-300 rounded-xl mb-3'
				onPress={() => setScreen('petTypes')}
			>
				<Text>
					Pet Types:{' '}
					{selectedPetTypes.length
						? selectedPetTypes.join(', ')
						: 'Not selected'}
				</Text>
			</TouchableOpacity>

			<Button
				title='Apply'
				onPress={() => {
					onApply({
						location: selectedCity,
						skills: selectedSkills,
						petTypes: selectedPetTypes
					});
				}}
				classes='mt-6'
			/>

			<Button
				title='Close'
				onPress={onClose}
				variant='default'
				classes='mt-2'
			/>
		</View>
	);

	const renderSelection = (
		title: string,
		options: string[],
		selected: string[] | string,
		setFn: any,
		isSingleSelect = false
	) => (
		<View>
			<Text className='text-xl font-bold mb-4'>{title}</Text>
			{options.map((option) => {
				const isSelected = isSingleSelect
					? selected === option
					: selected.includes(option);

				return (
					<TouchableOpacity
						key={option}
						className={`p-3 rounded-xl mb-2 ${
							isSelected ? 'bg-primary' : 'bg-gray-200'
						}`}
						onPress={() =>
							toggleSelection(selected, option, setFn, isSingleSelect)
						}
					>
						<Text className={isSelected ? 'text-white' : 'text-black'}>
							{option}
						</Text>
					</TouchableOpacity>
				);
			})}

			<Button
				title='Back'
				onPress={() => setScreen('main')}
				variant='default'
				classes='mt-4'
			/>
		</View>
	);

	return (
		<Modal visible={visible} animationType='slide'>
			<ScrollView className='p-6' contentContainerStyle={{ paddingBottom: 60 }}>
				{screen === 'main' && renderMain()}
				{screen === 'city' &&
					renderSelection(
						'Select a city',
						kazakhstanCities,
						selectedCity,
						setSelectedCity,
						true // одиночный выбор
					)}
				{screen === 'skills' &&
					renderSelection(
						'Select skills',
						skillsOptions,
						selectedSkills,
						setSelectedSkills
					)}
				{screen === 'petTypes' &&
					renderSelection(
						'Select pet types',
						petTypesOptions,
						selectedPetTypes,
						setSelectedPetTypes
					)}
			</ScrollView>
		</Modal>
	);
};

export default SitterFilterModal;

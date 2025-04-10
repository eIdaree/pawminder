import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { kazakhstanCities } from '@/constants/city';
import { Button } from './shared/Button';

const skillsOptions = ['Прогулка', 'Дрессировка', 'Уход', 'Медицинская помощь'];
const petTypesOptions = ['Собаки', 'Кошки', 'Птицы', 'Рептилии'];

const SitterFilterModal = ({ visible, onClose, onApply }) => {
	const [screen, setScreen] = useState<'main' | 'city' | 'skills' | 'petTypes'>(
		'main'
	);
	const [selectedCity, setSelectedCity] = useState('');
	const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
	const [selectedPetTypes, setSelectedPetTypes] = useState<string[]>([]);

	const toggleSelection = (arr: string[], value: string, setFn: any) => {
		if (arr.includes(value)) {
			setFn(arr.filter((item) => item !== value));
		} else {
			setFn([...arr, value]);
		}
	};

	const renderMain = () => (
		<View>
			<Text className='text-xl font-bold mb-4'>Фильтры</Text>

			<TouchableOpacity
				className='p-4 border border-gray-300 rounded-xl mb-3'
				onPress={() => setScreen('city')}
			>
				<Text>Город: {selectedCity || 'Не выбран'}</Text>
			</TouchableOpacity>

			<TouchableOpacity
				className='p-4 border border-gray-300 rounded-xl mb-3'
				onPress={() => setScreen('skills')}
			>
				<Text>
					Навыки:{' '}
					{selectedSkills.length ? selectedSkills.join(', ') : 'Не выбраны'}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				className='p-4 border border-gray-300 rounded-xl mb-3'
				onPress={() => setScreen('petTypes')}
			>
				<Text>
					Типы животных:{' '}
					{selectedPetTypes.length ? selectedPetTypes.join(', ') : 'Не выбраны'}
				</Text>
			</TouchableOpacity>

			<Button
				title='Применить'
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
				title='Закрыть'
				onPress={onClose}
				variant='default'
				classes='mt-2'
			/>
		</View>
	);

	const renderSelection = (
		title: string,
		options: string[],
		selected: string[],
		setFn: any
	) => (
		<View>
			<Text className='text-xl font-bold mb-4'>{title}</Text>
			{options.map((option) => (
				<TouchableOpacity
					key={option}
					className={`p-3 rounded-xl mb-2 ${
						selected.includes(option) ? 'bg-primary text-white' : 'bg-gray-200'
					}`}
					onPress={() => toggleSelection(selected, option, setFn)}
				>
					<Text>{option}</Text>
				</TouchableOpacity>
			))}

			<Button
				title='Назад'
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
						'Выберите город',
						kazakhstanCities,
						[selectedCity],
						([val]) => setSelectedCity(val)
					)}
				{screen === 'skills' &&
					renderSelection(
						'Выберите навыки',
						skillsOptions,
						selectedSkills,
						setSelectedSkills
					)}
				{screen === 'petTypes' &&
					renderSelection(
						'Выберите типы животных',
						petTypesOptions,
						selectedPetTypes,
						setSelectedPetTypes
					)}
			</ScrollView>
		</Modal>
	);
};

export default SitterFilterModal;

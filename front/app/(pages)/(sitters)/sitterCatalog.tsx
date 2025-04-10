import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Modal,
	Pressable,
	TextInput,
	Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import SitterCard from '@/components/SitterCard';
import SitterFilterModal from '@/components/SitterFilterModal';
import { Sitter } from '@/types/types';
import { icons } from '@/constants';

const SitterCatalog = () => {
	const [sitters, setSitters] = useState([]);
	const [filtersVisible, setFiltersVisible] = useState(false);
	const [filters, setFilters] = useState({
		location: '',
		petTypes: [],
		skills: []
	});
	const [search, setSearch] = useState('');

	const fetchSitters = async () => {
		try {
			console.log('Fetching sitters with filters:', filters);

			const query = new URLSearchParams();

			if (filters.location && filters.location.trim() !== '') {
				query.append('location', filters.location);
			}

			if (Array.isArray(filters.petTypes) && filters.petTypes.length > 0) {
				filters.petTypes.forEach((type) => query.append('petTypes', type));
			}

			if (Array.isArray(filters.skills) && filters.skills.length > 0) {
				filters.skills.forEach((skill) => query.append('skills', skill));
			}
			console.log('Query params:', query.toString());
			const res = await fetch(
				`${process.env.EXPO_PUBLIC_BASE_URL}/users/sitters?${query.toString()}`
			);

			const data = await res.json();
			console.log('Sitters fetched:', data);
			setSitters(data);
		} catch (err) {
			console.error('Ошибка получения нянь:', err);
		}
	};
	const handleSearch = () => {
		setFilters((prev) => ({ ...prev, first_name: search }));
	};

	useEffect(() => {
		fetchSitters();
	}, [filters]);

	return (
		<View className='flex-1 bg-background pt-3 px-2'>
			<View className='flex-row justify-between items-center px-2 py-2 mb-3'>
				<View className=' mr-2 bg-white border border-gray-300 rounded-full min-w-[260px] px-4'>
					<TextInput
						placeholder='Seach'
						value={search}
						onChangeText={setSearch}
						onSubmitEditing={handleSearch}
						className='text-sm'
					/>
				</View>
				<TouchableOpacity onPress={() => setFiltersVisible(true)}>
					<Image source={icons.filter} className='w-8 h-8' />
				</TouchableOpacity>
			</View>

			<ScrollView className='min-w-[328px] pt-4'>
				{sitters.map((sitter: Sitter) => (
					<SitterCard key={sitter.id} sitter={sitter} />
				))}
			</ScrollView>

			<SitterFilterModal
				visible={filtersVisible}
				onClose={() => setFiltersVisible(false)}
				onApply={(newFilters) => {
					setFilters(newFilters);
					setFiltersVisible(false);
				}}
			/>
		</View>
	);
};

export default SitterCatalog;

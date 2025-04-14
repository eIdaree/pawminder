import React, { useState, useRef, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	Image,
	TouchableOpacity,
	Linking
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { icons } from '@/constants';
import { BackButton } from '@/components/shared/BackButton';

const getMarkerIcon = (type: 'walk' | 'cafe') => {
	switch (type) {
		case 'walk':
			return require('../../assets/images/icons/parkmark.png');
		case 'cafe':
			return require('../../assets/images/icons/petcafemark.png');
		default:
			return require('../../assets/images/icons/parkmark.png');
	}
};

type PlaceProp = {
	id: string;
	title: string;
	description: string;
	type: 'walk' | 'cafe';
	latitude: number;
	longitude: number;
	image: string;
	mapUrl: string;
};
const places: PlaceProp[] = [
	{
		id: '1',
		title: 'Park Ghandi',
		description: 'Walking area for pets',
		type: 'walk',
		latitude: 43.243669,
		longitude: 76.895602,
		image:
			'https://lh3.googleusercontent.com/p/AF1QipMBgvpN3Ps58uNnxhpZ8tNCnn7VnfmSZpoQU3EV=w408-h544-k-no',
		mapUrl: 'https://2gis.kz/almaty/geo/70000001089141107/76.895607,43.243671'
	},
	{
		id: '2',
		title: 'Forest belt of Lake Sayran',
		description: 'Walking area for pets',
		type: 'walk',
		latitude: 43.240212,
		longitude: 76.865916,
		image:
			'https://lh3.googleusercontent.com/p/AF1QipNSlE-ZnNrCu1ZyqAqLQfB7yNLGj2E1HRd1wPfs=w408-h240-k-no-pi-0-ya161.99998-ro-0-fo100',
		mapUrl: 'https://2gis.kz/almaty/geo/70030076167495648/76.869643,43.236275'
	},
	{
		id: '3',
		title: 'Dom 36 Culture center',
		description: 'Center with culture meaning that you can visit with your pet',
		type: 'cafe',
		latitude: 43.260454,
		longitude: 76.963735,
		image:
			'https://lh3.googleusercontent.com/p/AF1QipNulK_1BCUmgFKZqVZ4i3xCXwoWh9KI1yTnSUh-=w408-h306-k-no',
		mapUrl: 'https://2gis.kz/almaty/geo/9430047375036884/76.963766,43.260273'
	}
];

const MapScreen = () => {
	const [filter, setFilter] = useState('all');
	const [selectedPlace, setSelectedPlace] = useState(null);
	const [showFilter, setShowFilter] = useState(false);
	const [search, setSearch] = useState('');
	const [isMapReady, setIsMapReady] = useState(false);
	const mapRef = useRef(null);

	const filteredPlaces = places.filter(
		(place) =>
			(filter === 'all' || place.type === filter) &&
			place.title.toLowerCase().includes(search.toLowerCase())
	);

	useEffect(() => {
		if (isMapReady) {
			const timeout = setTimeout(() => fitMarkers(), 300);
			return () => clearTimeout(timeout);
		}
	}, [filter, search, isMapReady]);

	const fitMarkers = () => {
		if (filteredPlaces.length && mapRef.current) {
			mapRef.current.fitToCoordinates(
				filteredPlaces.map((p) => ({
					latitude: p.latitude,
					longitude: p.longitude
				})),
				{
					edgePadding: { top: 80, right: 80, bottom: 300, left: 80 },
					animated: true
				}
			);
		}
	};

	const handleMapLayout = () => {
		setIsMapReady(true);
		fitMarkers();
	};

	return (
		<View className='flex-1 bg-white'>
			<BackButton />

			<View className='absolute z-10 top-16 w-full px-3'>
				<View className='flex-row items-center bg-white rounded-full shadow px-4 py-2'>
					<Image source={icons.search} className='w-5 h-5 mr-2' />
					<TextInput
						placeholder='Search places...'
						value={search}
						onChangeText={setSearch}
						className='flex-1 text-sm'
					/>
					<TouchableOpacity onPress={() => setShowFilter(!showFilter)}>
						<Image source={icons.filter} className='w-6 h-6 ml-2' />
					</TouchableOpacity>
				</View>
			</View>

			{showFilter && (
				<View className='absolute right-0 h-full w-[60%] bg-primary/80 p-4 z-20'>
					<TouchableOpacity
						onPress={() => setShowFilter(false)}
						className='self-end mb-4 '
					>
						<Image
							source={icons.closecircle}
							className='w-8 h-8 tint-primary'
						/>
					</TouchableOpacity>

					{['all', 'walk', 'cafe'].map((type) => (
						<TouchableOpacity
							key={type}
							onPress={() => {
								setFilter(type);
								setShowFilter(false);
							}}
							className={` px-4 py-3 rounded-xl mb-3 ${
								filter === type ? ' border-white' : ''
							}`}
						>
							<Text className='text-white font-PoppinsSemiBold text-base text-center border-b-2 border-white'>
								{type === 'walk'
									? 'Walking zone'
									: type === 'cafe'
									? 'Cafe'
									: 'All'}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			)}

			<MapView
				ref={mapRef}
				className='flex-1'
				initialRegion={{
					latitude: 43.244,
					longitude: 76.8966,
					latitudeDelta: 0.07,
					longitudeDelta: 0.07
				}}
				loadingEnabled
				onLayout={handleMapLayout}
			>
				{filteredPlaces.map((place) => (
					<Marker
						key={place.id}
						coordinate={{
							latitude: place.latitude,
							longitude: place.longitude
						}}
						title={place.title}
						description={place.description}
						onPress={() => setSelectedPlace(place)}
						image={
							place.type === 'walk'
								? require('../../assets/images/icons/parkmark.png')
								: require('../../assets/images/icons/petcafemark.png')
						}
						// icon={}
					/>
				))}
			</MapView>

			{selectedPlace && (
				<View className='absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-lg'>
					<TouchableOpacity
						onPress={() => setSelectedPlace(null)}
						className='absolute -top-6 right-4 bg-gray-200 p-2 rounded-full'
					>
						<Text className='text-xl'>✕</Text>
					</TouchableOpacity>

					<Image
						source={{ uri: selectedPlace.image || '' }}
						className='w-full h-40 rounded-xl mb-3'
					/>
					<Text className='text-xl font-bold mb-1'>{selectedPlace.title}</Text>
					<Text className='text-gray-600 mb-3'>
						{selectedPlace.description}
					</Text>
					<TouchableOpacity
						className='bg-primary rounded-xl py-3'
						onPress={() =>
							Linking.openURL(selectedPlace.mapUrl || '').catch(() =>
								alert('Cannot open map link')
							)
						}
					>
						<Text className='text-white text-center font-semibold'>
							View on map
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default MapScreen;

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
import { Pet } from '@/types/types';

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
	},
	{
		id: '4',
		title: 'Marka Coffee  ',
		description:
			'Marka Coffee is a cozy pet-friendly café serving all-day breakfast, aromatic coffee, and delicious desserts in a stylish space where both you and your furry friend will feel right at home.',
		type: 'cafe',
		latitude: 43.23231658192877,
		longitude: 76.89892571260981,
		image:
			'https://avatars.mds.yandex.net/get-altay/5965316/2a000001815d9ae0d6ef825f4326e38209e8/L_height',
		mapUrl:
			'https://2gis.kz/almaty/firm/70000001052439549?m=76.897067%2C43.232771%2F17.49%2Fp%2F1.56%2Fr%2F-35.48'
	},
	{
		id: '5',
		title: 'TeaDot',
		description:
			'Teadot serves unique Chinese bubble tea and welcomes small pets inside in carriers, with all furry friends welcome on the terrace during warm weather.',
		type: 'cafe',
		latitude: 43.22624425452553,
		longitude: 76.90917902843739,
		image:
			'https://lh3.googleusercontent.com/p/AF1QipPv9C-1g5dI7gp9-9pAsLQafjvmBZ8a0pM4f4Jl=w408-h408-k-no',
		mapUrl:
			'https://2gis.kz/almaty/search/teadot/firm/70000001044612660/76.909233%2C43.225826?m=76.901288%2C43.230559%2F14.52%2Fp%2F1.56%2Fr%2F-25.46'
	},

	{
		id: '6',
		title: 'Bowler coffee roasters ',
		description:
			'This charming little spot brings the spirit of Dutch culture, serving fresh pastries and coffee, and warmly welcoming four-legged guests with water bowls always available on request.',
		type: 'cafe',
		latitude: 43.26271745737686,
		longitude: 76.94257147288225,
		image:
			'https://lh3.googleusercontent.com/p/AF1QipOJkT2lWMtn8eXGDagq7doc-CPAzyQtEBYwbazV=w426-h240-k-no',
		mapUrl:
			'https://2gis.kz/almaty/branches/70000001029259351/firm/70000001029259352/76.942463%2C43.262555?m=76.907132%2C43.237712%2F12.3%2Fp%2F1.56%2Fr%2F-15.34'
	},

	{
		id: '7',
		title: 'Umami ',
		description:
			'Umami offers a wide range of ice cream—from classic sweet to spicy chili flavors—including sugar-free options, along with waffles and coffee, and welcomes pets of all sizes.',
		type: 'cafe',
		latitude: 43.24748982665377,
		longitude: 76.94099545992236,
		image:
			'https://weproject.media/upload/medialibrary/236/236a7f630570cc9e62e775bdf1514bd5.JPG',
		mapUrl:
			'https://2gis.kz/almaty/search/umami/firm/70000001080959278/76.941713%2C43.247456?m=76.907131%2C43.237743%2F11.7%2Fp%2F1.56%2Fr%2F-13.09'
	},

	{
		id: '8',
		title: 'Jump-In-Goat Coffee  ',
		description:
			'JumpinGoat offers coffee from 10 countries and stands out as a place where cats can roam freely, while dogs are welcome to relax by their owners.',
		type: 'cafe',
		latitude: 43.2429750653155,
		longitude: 76.94785799339994,
		image:
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu6upGhICrnq2-uE0YLbkRVuQNJMue3jNPjQ&s',
		mapUrl:
			'https://2gis.kz/almaty/search/jumpingoat/firm/70000001021307438/76.947899%2C43.242886?m=76.947914%2C43.242906%2F16.96%2Fp%2F1.56%2Fr%2F-11.16'
	},
	{
		id: '9',
		title: 'Dostyk Park',
		description:
			'Dostyk Park in the Bostandyk District is a pet-friendly green space with a dedicated dog training area, over 200 newly planted trees, lighting, and surveillance cameras—perfect for a safe and enjoyable walk.',
		type: 'walk',
		latitude: 43.22569,
		longitude: 76.92797,
		image:
			'https://lh5.googleusercontent.com/ZMgkKm_TG3AuV-YXeLBfxg-PSKCO9YVU7qvoA342ppC4fklV2KkUbPdwPreF4z6pj55Rv4ktJUbL3q-I2OXkIC9Bu1V0t_CltHip51X4ir-0mED1TpZ5Zdu0baxFZpdty7Ljob3u',
		mapUrl:
			'https://2gis.kz/almaty/search/%D0%BF%D0%B0%D1%80%D0%BA%20%D0%B4%D1%80%D1%83%D0%B6%D0%B1%D0%B0/geo/9430098914574549/76.92797%2C43.22569?m=76.907131%2C43.237812%2F11.17%2Fp%2F1.56%2Fr%2F-10.89'
	},
	{
		id: '10',
		title: 'Park "Yuzhny',
		description:
			'Park "Yuzhny" is also known to city residents under the name "Alley of graduates". Here in the very center there is a fenced area for walking and training dogs. On the territory of the park there is a paid toilet, a workout area and playgrounds.',
		type: 'walk',
		latitude: 43.211861,
		longitude: 76.904958,
		image:
			'https://lh3.googleusercontent.com/xQU8ShD_pLLpj2L1PDVgtjz-N6nQlUxvmHXdLF3kb-dJTbznRvH9NmGNTgjyrav51capyvGU0GG3oo_N25Wel3-BD5Potr0y5WDFnrNMPXJu9XZJB9KgIjME9vZVb2qgtw41QFQN',
		mapUrl:
			'https://2gis.kz/almaty/search/%D0%BF%D0%B0%D1%80%D0%BA%20%D1%8E%D0%B6%D0%BD%D1%8B%D0%B9%20/geo/70030076130021037/76.904958%2C43.211861?m=76.907131%2C43.237948%2F10.71%2Fp%2F1.56%2Fr%2F-9.29'
	},
	{
		id: '11',
		title: 'Park Yuzhny ',
		description:
			'Park Yuzhny is also known to city residents under the name "Alley of graduates". Here in the very center there is a fenced area for walking and training dogs. On the territory of the park there is a paid toilet, a workout area and playgrounds.',
		type: 'walk',
		latitude: 43.242559,
		longitude: 76.914018,
		image:
			'https://lh3.googleusercontent.com/xQU8ShD_pLLpj2L1PDVgtjz-N6nQlUxvmHXdLF3kb-dJTbznRvH9NmGNTgjyrav51capyvGU0GG3oo_N25Wel3-BD5Potr0y5WDFnrNMPXJu9XZJB9KgIjME9vZVb2qgtw41QFQN',
		mapUrl:
			'https://2gis.kz/almaty/search/%D0%BF%D0%B0%D1%80%D0%BA%20%D1%8E%D0%B6%D0%BD%D1%8B%D0%B9%20/geo/70030076130021037/76.904958%2C43.211861?m=76.907131%2C43.237948%2F10.71%2Fp%2F1.56%2Fr%2F-9.29'
	},
	{
		id: '12',
		title: 'Biokombinat Park',
		description:
			'Biokombinat Park is a peaceful, well-kept space ideal for dog walks, with sports areas for running, football, basketball, and workout, as well as a children’s playground.',
		type: 'walk',
		latitude: 43.242589,
		longitude: 76.913393,
		image:
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1JY3jZmZD4KclsqmxfMDphjEUk_9Flyz0bQ&s',
		mapUrl:
			'https://2gis.kz/almaty/search/%D0%9F%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%BE%D0%B1%D0%B0%D0%BA/geo/70030076166699809/76.913393%2C43.242589/tab/reviews?m=76.915983%2C43.241851%2F15.49%2Fp%2F10.92%2Fr%2F27.03'
	}
];

const MapScreen = () => {
	const [filter, setFilter] = useState('all');
	const [selectedPlace, setSelectedPlace] = useState<PlaceProp | null>(null);
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

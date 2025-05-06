import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	// Image,
	Pressable
} from 'react-native';
import { useEffect, useState } from 'react';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring
} from 'react-native-reanimated';
import {
	PanGestureHandler,
	GestureHandlerRootView,
	State
} from 'react-native-gesture-handler';
import FeatureButton from '@/components/FeatureButton';
import { router } from 'expo-router';
import { icons, images } from '@/constants';
import { Button } from '@/components/shared/Button';
import { useAuth } from '@/context/AuthContext';
import { Pet } from '@/types/types';
import { usePets } from '@/context/PetContext';
import { calculateAge } from '@/helper/calculateAge';
import { toParams } from '@/utils/toParams';
import { Todo } from '@/types/types';
import { Image } from 'expo-image';

const PetCarousel = ({ activeIndex, setActiveIndex, pets }) => {
	return (
		<View className='flex-row justify-center mt-4'>
			{pets.map((item, index) => (
				<TouchableOpacity key={item.id} onPress={() => setActiveIndex(index)}>
					<View
						className={`mx-1 h-1 rounded-xl ${
							index === activeIndex ? 'w-5 bg-primary' : 'w-2.5 bg-gray-300'
						}`}
					/>
				</TouchableOpacity>
			))}
		</View>
	);
};

const PetInfo = ({ pet }: { pet: Pet }) => {
	const age = calculateAge(pet.date_of_birth);
	return (
		<Pressable
			onPress={() =>
				router.push({
					pathname: '/(pages)/(pets)/PetProfile',
					params: toParams(pet)
				})
			}
		>
			<View className='flex-row mt-6 py-4 px-[5px] min-w-[327px] h-[132px] bg-white rounded-xl shadow-md items-center'>
				<Image
					source={{
						uri: `${process.env.EXPO_PUBLIC_BASE_URL}/pet/${pet.photo}`
					}}
					className='w-[102px] h-[102px] rounded-lg  ml-1'
				/>
				<View className='ml-4  w-[192px] h-[94px] flex-column justify-center items-center'>
					<Text className='text-2xl font-PoppinsBold  text-center mt-2'>
						{pet.name}
					</Text>
					<View className='flex-row my-3 mx-auto'>
						<View className='items-center flex-1'>
							<Image source={icons.man} style={{ width: 24, height: 24 }} />
							<Text className='font-PoppinsRegular mt-2'>{pet.gender}</Text>
						</View>
						<View className='items-center flex-1'>
							<Image
								source={icons.calendar}
								style={{ width: 24, height: 24 }}
							/>
							<Text className='font-PoppinsRegular mt-2'>
								{`${age.years}y ${age.months}m`}
							</Text>
						</View>
						<View className='items-center flex-1'>
							<Image source={icons.weight} style={{ width: 24, height: 24 }} />
							<Text className='font-PoppinsRegular mt-2'>{pet.weight} kg</Text>
						</View>
					</View>
				</View>
			</View>
		</Pressable>
	);
};

const PetStatus = ({ pet }: { pet: Pet }) => {
	const [firstTask, setFirstTask] = useState<Todo | null>(null);
	const baseURL = process.env.EXPO_PUBLIC_BASE_URL;

	useEffect(() => {
		const fetchFirstTask = async () => {
			try {
				const res = await fetch(`${baseURL}/tasks/pet/${pet.id}`);
				const data: Todo[] = await res.json();
				if (Array.isArray(data) && data.length > 0) {
					setFirstTask(data[0]);
				}
			} catch (err) {
				console.error('Failed to fetch tasks', err);
			}
		};

		fetchFirstTask();
	}, [pet.id]);

	return (
		<View className='bg-white min-w-[327px] h-[300px] rounded-xl my-2'>
			<View className='w-full h-full relative rounded-xl overflow-hidden'>
				<Image
					source={images.container}
					className='absolute w-full h-full'
					resizeMode='cover'
				/>

				<View className='absolute top-3 left-0 right-0 flex-row justify-center items-center px-4'>
					<View className='border border-primary px-6 py-3 rounded-2xl bg-white/80'>
						<Text className='text-text text-base font-PoppinsBold text-center'>
							{firstTask ? firstTask.title : 'No tasks available'}
						</Text>
					</View>
				</View>

				<View className='absolute bottom-4 left-0 right-0 items-center'>
					<Image
						// source={pet.species === '🐱 Cat' ? images.catAva : images.dogAva}
						source={
							pet.species === '🐱 Cat'
								? require('@/assets/images/pets_svg/cat.gif')
								: require('@/assets/images/pets_svg/dog.gif')
						}
						// source={require(`@/assets/images/pets_svg/dog.gif`)}
						className='w-40 h-48'
						autoplay
						resizeMode='contain'
					/>
				</View>
			</View>
		</View>
	);
};
const features = [
	{
		title: 'To-do',
		route: '/(pages)/todo',
		color: '#674CFF',
		icon: images.todo
	},
	{
		title: 'Notes',
		route: '/(pages)/(notes)/notes',
		color: '#8A75FF',
		icon: images.notes
	}
];

const PetActions = ({ petId }: { petId: number }) => (
	<View className='flex-row flex-wrap justify-between mt-1'>
		{features.map((feature, index) => (
			<FeatureButton
				key={index}
				title={feature.title}
				icon={feature.icon}
				onPress={() =>
					router.push({
						pathname: feature.route as any,
						params: { petId: petId.toString() }
					})
				}
				color={feature.color}
			/>
		))}
	</View>
);

export default function PetProfile() {
	const [activeIndex, setActiveIndex] = useState(0);
	// const { user } = useAuth();
	// const [pets, setPets] = useState<Array<Pet>>([]);
	// const [loading, setLoading] = useState(true);
	const { pets } = usePets();

	const allSlides = [...pets, { id: 'add-pet', name: 'Add a Pet' }];
	const activePet = allSlides[activeIndex];
	const isAddPetCard = activePet.id === 'add-pet';
	console.log('pets', pets);

	return (
		<GestureHandlerRootView className='flex-1'>
			<PanGestureHandler
				onHandlerStateChange={({ nativeEvent }) => {
					if (nativeEvent.state === State.END) {
						const { translationX } = nativeEvent;
						if (translationX < -80 && activeIndex < allSlides.length - 1) {
							setActiveIndex(activeIndex + 1);
						} else if (translationX > 80 && activeIndex > 0) {
							setActiveIndex(activeIndex - 1);
						}
					}
				}}
			>
				<View className='flex-1 p-4'>
					<PetCarousel
						activeIndex={activeIndex}
						setActiveIndex={setActiveIndex}
						pets={allSlides}
					/>
					{isAddPetCard ? (
						<View className='h-full w-[90%] mx-auto'>
							<Text className='text-4xl text-center font-bold mt-10'>
								Wanna add pet?
							</Text>
							<Text className='text-base text-gray-400 text-center mt-5 mb-14'>
								add your pets profile
							</Text>
							<View className=' border-2 border-dashed border-indigo-400  mb-6'>
								<Image
									source={icons.catdog}
									className='w-[201.73px] h-[218px] items-center mx-auto my-11'
								/>
							</View>
							<Button
								title='Add New pet'
								size='lg'
								onPress={() => router.push('/(pages)/(pets)/addpet')}
								variant='primary'
								classes='mx-auto'
							/>
						</View>
					) : (
						<>
							<PetInfo pet={activePet} />
							<PetStatus pet={activePet} />
							<PetActions
								petId={typeof activePet.id === 'number' ? activePet.id : 0}
							/>
						</>
					)}
				</View>
			</PanGestureHandler>
		</GestureHandlerRootView>
	);
}

import React, { useCallback, useEffect, useState } from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	Dimensions
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Button } from '@/components/shared/Button';
import { BackButton } from '@/components/shared/BackButton';

interface Note {
	id: number;
	title: string;
	content: string;
	createdAt: string;
}

const NotesScreen = () => {
	const { petId } = useLocalSearchParams();
	const [notes, setNotes] = useState<Note[]>([]);
	const router = useRouter();
	const baseURL = process.env.EXPO_PUBLIC_BASE_URL;

	useEffect(() => {
		if (petId) fetchNotes();
	}, [petId]);

	const fetchNotes = async () => {
		try {
			const res = await fetch(`${baseURL}/notes/pet/${petId}`);
			const data = await res.json();
			setNotes(data);
		} catch (error) {
			console.error('Failed to load notes', error);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchNotes();
		}, [])
	);

	const renderNote = ({ item }: { item: Note }) => (
		<TouchableOpacity
			onPress={() =>
				router.push({
					pathname: '/(pages)/(notes)/notes-detail/[noteId]',
					params: { noteId: item.id.toString() }
				})
			}
			className='bg-white rounded-2xl py-4 px-3 m-1 flex-1 shadow'
			style={{ minHeight: 160 }}
		>
			<Text className='font-PoppinsSemiBold text-base '>{item.title}</Text>
			<Text className='text-sm text-darkgray'>{item.createdAt}</Text>
			<Text className='text-sm text-darkgray' numberOfLines={3}>
				{item.content}
			</Text>
		</TouchableOpacity>
	);

	return (
		<>
			<BackButton />
			<View className='flex-1 bg-background pt-16 px-4 pb-24'>
				<Text className='text-[32px] font-PoppinsSemiBold mb-4'>Notes</Text>

				{notes.length === 0 ? (
					<View className='flex-1 justify-center items-center'>
						<Text className='text-center text-3xl font-PoppinsMedium text-darkgray'>
							No notes here...
						</Text>
					</View>
				) : (
					<FlatList
						data={notes}
						keyExtractor={(item) => item.id.toString()}
						renderItem={renderNote}
						numColumns={2}
						columnWrapperStyle={{ justifyContent: 'space-between' }}
						contentContainerStyle={{ paddingBottom: 100 }}
						showsVerticalScrollIndicator={false}
					/>
				)}

				{/* Add Note Button (абсолютно снизу по центру) */}
				<View className='absolute bottom-6 left-0 right-0 items-center'>
					<Button
						title='Add Note'
						variant='primary'
						size='lg'
						onPress={() =>
							router.push({
								pathname: '/(pages)/(notes)/note-create',
								params: { petId: petId as string }
							})
						}
					/>
				</View>
			</View>
		</>
	);
};

export default NotesScreen;

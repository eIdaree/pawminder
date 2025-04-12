import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
	Image,
	ScrollView
} from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackButton } from '@/components/shared/BackButton';
import { icons } from '@/constants';

interface Note {
	id: number;
	title: string;
	content: string;
	created_at: string;
}

export default function NoteDetail() {
	const { noteId } = useLocalSearchParams();
	const router = useRouter();
	const [note, setNote] = useState<Note | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const baseURL = process.env.EXPO_PUBLIC_BASE_URL;

	useEffect(() => {
		fetchNote();
	}, []);

	const fetchNote = async () => {
		try {
			const res = await fetch(`${baseURL}/notes/${noteId}`);
			const data = await res.json();
			if (!res.ok) {
				console.log('ress', res);
				throw 'Something happened in server';
			}
			setNote(data);
			setTitle(data.title);
			setContent(data.content);
		} catch (err) {
			console.error('Failed to load note', err);
		}
	};

	const updateNote = async () => {
		try {
			await fetch(`${baseURL}/notes/${noteId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, content })
			});
			setIsEditing(false);
			fetchNote();
		} catch (err) {
			console.error('Error updating note', err);
		}
	};

	const deleteNote = async () => {
		Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				style: 'destructive',
				onPress: async () => {
					try {
						await fetch(`${baseURL}/notes/${noteId}`, {
							method: 'DELETE'
						});
						router.back();
					} catch (err) {
						console.error('Error deleting note', err);
					}
				}
			}
		]);
	};

	if (!note) return <Text className='text-center mt-20'>Loading...</Text>;

	return (
		<>
			<BackButton />
			<ScrollView className='flex-1  p-5 pt-20'>
				<View className='flex-row justify-between items-start mb-4'>
					<View>
						<Text className='text-3xl font-PoppinsSemiBold'>
							{isEditing ? '' : note.title}
						</Text>
						<Text className='text-sm text-darkgray'>
							{new Date(note.created_at).toLocaleDateString()}
						</Text>
					</View>
					<TouchableOpacity
						onPress={() => {
							if (isEditing) deleteNote();
							else setIsEditing(true);
						}}
					>
						<Image source={isEditing ? icons.trash : icons.pencil} />
					</TouchableOpacity>
				</View>

				{isEditing ? (
					<>
						<TextInput
							value={title}
							onChangeText={setTitle}
							className='text-xl font-PoppinsBold border-b mb-4'
						/>
						<TextInput
							value={content}
							onChangeText={setContent}
							multiline
							textAlignVertical='top'
							className='min-h-[200px] text-base'
						/>
						<TouchableOpacity
							className='bg-primary mt-6 py-3 rounded-xl'
							onPress={updateNote}
						>
							<Text className='text-white text-center font-PoppinsSemiBold'>
								Save Changes
							</Text>
						</TouchableOpacity>
					</>
				) : (
					<Text className='border border-gray-300 bg-white rounded-xl p-3 text-base min-h-[300px]'>
						{note.content}
					</Text>
				)}
			</ScrollView>
		</>
	);
}

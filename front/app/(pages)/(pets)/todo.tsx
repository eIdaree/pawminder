// app/(pages)/todo.tsx
import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	FlatList,
	TouchableOpacity,
	Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { BackButton } from '@/components/shared/BackButton';
import { icons } from '@/constants';
import { Todo } from '@/types/types';

const TodoScreen = () => {
	const { petId } = useLocalSearchParams();
	const [todos, setTodos] = useState<Todo[]>([]);
	const [newTodo, setNewTodo] = useState('');
	const [editMode, setEditMode] = useState(false);
	const baseURL = process.env.EXPO_PUBLIC_BASE_URL;

	useEffect(() => {
		if (petId) fetchTodos(petId);
	}, [petId]);

	const fetchTodos = async (id: string | string[]) => {
		console.log('Calling');
		try {
			const res = await fetch(`${baseURL}/tasks/pet/${id}`);
			const data = await res.json();
			if (!res.ok || !Array.isArray(data)) {
				console.warn('Invalid data from API', data);
				setTodos([]);
				return;
			}
			setTodos(data);
		} catch (err) {
			console.error('Failed to fetch tasks', err);
		}
	};

	const addTodo = async () => {
		if (!newTodo.trim()) return;
		try {
			const res = await fetch(`${baseURL}/tasks`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: newTodo, petId: Number(petId) })
			});

			const task = await res.json();
			console.log('TODODODOD', task);
			setTodos((prev) => (Array.isArray(prev) ? [...prev, task] : [task]));

			setNewTodo('');
		} catch (err) {
			console.error('Error adding task:', err);
		}
	};

	const toggleTodo = async (id: number) => {
		const todo = todos.find((t) => t.id === id);
		if (!todo) return;
		try {
			console.log('Sending to backend:', { completed: !todo.completed });
			const res = await fetch(`${baseURL}/tasks/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ completed: !todo.completed })
			});
			const updated = await res.json();
			console.log('fdsfs', updated);
			setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
		} catch (err) {
			console.error('Error toggling task:', err);
		}
	};

	const deleteTodo = async (id: number) => {
		try {
			await fetch(`${baseURL}/tasks/${id}`, { method: 'DELETE' });
			setTodos((prev) => prev.filter((t) => t.id !== id));
		} catch (err) {
			console.error('Error deleting task:', err);
		}
	};

	return (
		<>
			<BackButton />
			<View className='flex-1 bg-background px-4 pt-6'>
				<View className='flex-row justify-between items-center mb-4 mt-14'>
					<Text className='text-[32px] font-PoppinsSemiBold'>To-Do List</Text>
					<TouchableOpacity onPress={() => setEditMode((prev) => !prev)}>
						<Image source={editMode ? icons.close : icons.pencil}></Image>
					</TouchableOpacity>
				</View>

				<FlatList
					data={todos}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
						<View className='flex-row max-w-[328px] w-full bg-white items-center rounded-2xl mb-3 py-3 px-2'>
							<TouchableOpacity
								className={`w-6 h-6 rounded-md border-2 ${
									item.completed ? ' border-primary' : 'border-darkgray'
								} items-center justify-center`}
								onPress={() => toggleTodo(item.id)}
							>
								{item.completed && (
									<Image source={icons.petpawcomplete}></Image>
								)}
							</TouchableOpacity>
							<Text
								className={`ml-4 flex-1 font-PoppinsMedium text-base ${
									item.completed
										? 'line-through text-primary'
										: editMode
										? 'text-gray-400'
										: 'text-black'
								}`}
							>
								{item.title}
							</Text>
							{editMode && (
								<TouchableOpacity onPress={() => deleteTodo(item.id)}>
									<Ionicons name='trash' size={20} color='#F44336' />
								</TouchableOpacity>
							)}
						</View>
					)}
					ListFooterComponent={
						<View className='flex-row max-w-[328px] w-full  bg-white rounded-2xl items-center py-1 px-2'>
							<View
								className={`w-6 h-6 rounded-md border-2 border-darkgray items-center justify-center`}
							></View>

							<TextInput
								value={newTodo}
								onChangeText={setNewTodo}
								placeholder='write smt here..'
								className='ml-4 flex-1 text-base font-PoppinsSemiBold text-darkgray'
								blurOnSubmit={true}
								returnKeyType='done'
								onSubmitEditing={addTodo}
							/>
						</View>
					}
				/>
			</View>
		</>
	);
};

export default TodoScreen;

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const toDoApp: React.FC = () => {
  const baseURL = process.env.EXPO_PUBLIC_BASE_URL; 
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${baseURL}/tasks/pet/3`);
      if (!response.ok) throw new Error("Failed to fetch todos");

      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const response = await fetch(`${baseURL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodo, petId: 3 }),
      });
      if (!response.ok) throw new Error("Failed to add todo");
      const newTask: Todo = await response.json();
      setTodos((prev) => [...prev, newTask]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const todo = todos.find((t) => t.id === id);
      console.log(todo);
      console.log(id)
      if (!todo) return;
      
      const response = await fetch(`${baseURL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });
      if (!response.ok) throw new Error("Failed to update todo");
      const updatedTask: Todo = await response.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${baseURL}/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete todo");
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-lg font-semibold text-center text-black mb-1">
        To Do list
      </Text>
      <Text className="text-sm text-center text-gray-500 mb-4">
        Be Organized, be in time
      </Text>

      {todos.length === 0 ? (
        <Text className="text-gray-400 text-center mt-8">Add to do</Text>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="flex-row items-center mb-2">
              <TouchableOpacity
                onPress={() => toggleTodo(item.id)}
                className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
                  item.completed ? "bg-black border-black" : "bg-transparent border-gray-300"
                }`}
              >
                {item.completed && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </TouchableOpacity>
              <Text
                className={`flex-1 ml-4 text-base ${
                  item.completed
                    ? "line-through text-gray-400"
                    : "text-black"
                }`}
              >
                {item.title} {item.completed ? "(Completed)" : ""}
              </Text>
              <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                <Ionicons name="trash" size={20} color="#F44336" />
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={
            <View className="">
              <View className="flex-row items-center pt-2">
                <TouchableOpacity onPress={addTodo} className="ml-2">
                  <Ionicons
                    name="add-outline"
                    size={25}
                    color="black"
                    className="border-[2px] border-black rounded-full p-1"
                  />
                </TouchableOpacity>
                <TextInput
                  className="flex-1 border-none text-gray-700 text-base"
                  placeholder="Add a new task"
                  placeholderTextColor="gray"
                  value={newTodo}
                  onChangeText={setNewTodo}
                />
              </View>
            </View>
          }
        />
      )}
    </View>
  );
};

export default toDoApp;

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Pet } from '@/types/types';
import { useAuth } from './AuthContext';

interface PetsContextProps {
	pets: Pet[];
	fetchPets: () => Promise<void>;
}

const PetsContext = createContext<PetsContextProps | undefined>(undefined);

export const PetsProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [pets, setPets] = useState<Pet[]>([]);
	const { user } = useAuth();

	const fetchPets = async () => {
		if (!user?.id) return;
		try {
			const response = await fetch(
				`${process.env.EXPO_PUBLIC_BASE_URL}/pets/${user.id}`
			);
			if (!response.ok) throw new Error('Failed to fetch pets');
			const data = await response.json();
			setPets(data);
		} catch (error) {
			console.error('Ошибка загрузки питомцев:', error);
		}
	};

	useEffect(() => {
		fetchPets();
	}, [user]);

	return (
		<PetsContext.Provider value={{ pets, fetchPets }}>
			{children}
		</PetsContext.Provider>
	);
};

export const usePets = () => {
	const context = useContext(PetsContext);
	if (!context) throw new Error('usePets must be used within a PetsProvider');
	return context;
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import { tokenCache } from '@/utils/auth';
import { useAuth } from '@/context/AuthContext';

const BalanceContext = createContext<BalanceContextType | null>(null);

export interface BalanceContextType {
	balance: number;
	transactions: any[];
	loading: boolean;
	fetchBalance: () => Promise<void>;
	topUp: (amount: number) => Promise<void>;
}

export const BalanceProvider = ({
	children
}: {
	children: React.ReactNode;
}) => {
	const [balance, setBalance] = useState(0);
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user } = useAuth(); // 👈 отслеживаем текущего пользователя

	const fetchBalance = async () => {
		try {
			setLoading(true);
			const token = await tokenCache.getToken('auth-token');
			const res = await fetch(
				`${process.env.EXPO_PUBLIC_BASE_URL}/users/me/balance`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}
			);
			const data = await res.json();
			setBalance(data.balance);
			setTransactions(data.transactions);
		} catch (err) {
			console.error('Ошибка при получении баланса:', err);
		} finally {
			setLoading(false);
		}
	};

	const topUp = async (amount: number) => {
		try {
			const token = await tokenCache.getToken('auth-token');
			const res = await fetch(
				`${process.env.EXPO_PUBLIC_BASE_URL}/users/me/top-up`,
				{
					method: 'PATCH',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ amount })
				}
			);
			if (!res.ok) throw new Error('Ошибка пополнения');
			await fetchBalance();
		} catch (err) {
			console.error('Ошибка при пополнении баланса:', err);
			throw err;
		}
	};

	// 🔁 обновляем каждый раз при смене пользователя
	useEffect(() => {
		if (user?.id) {
			fetchBalance();
		}
	}, [user?.id]);

	return (
		<BalanceContext.Provider
			value={{ balance, transactions, loading, fetchBalance, topUp }}
		>
			{children}
		</BalanceContext.Provider>
	);
};

export const useBalance = (): BalanceContextType => {
	const context = useContext(BalanceContext);
	if (!context)
		throw new Error('useBalance must be used within a BalanceProvider');
	return context;
};

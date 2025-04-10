import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { tokenCache } from '@/utils/auth';

type Mode = 'owner' | 'sitter';

export const useOrders = (mode: Mode = 'owner') => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const token = await tokenCache.getToken('auth-token');
			const url =
				mode === 'sitter'
					? `${process.env.EXPO_PUBLIC_BASE_URL}/orders/assigned`
					: `${process.env.EXPO_PUBLIC_BASE_URL}/orders/me`;

			const res = await fetch(url, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const data = await res.json();
			setOrders(data);
		} catch (err) {
			setError(err);
			console.error('Ошибка при получении заказов:', err);
		} finally {
			setLoading(false);
		}
	};

	const updateOrderStatus = async (
		orderId: number,
		updates: { status?: string; rating?: number; review?: string }
	) => {
		try {
			const token = await tokenCache.getToken('auth-token');
			const res = await fetch(
				`${process.env.EXPO_PUBLIC_BASE_URL}/orders/${orderId}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify(updates)
				}
			);
			if (!res.ok) throw new Error('Не удалось обновить заказ');
			await fetchOrders();
		} catch (err) {
			console.error('Ошибка обновления заказа:', err);
			throw err;
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	return {
		orders,
		loading,
		error,
		updateOrderStatus,
		refetch: fetchOrders
	};
};

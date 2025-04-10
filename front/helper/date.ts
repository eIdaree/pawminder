export const formatDateTime = (dateStr?: string): string => {
	if (!dateStr) return '—';
	const date = new Date(dateStr);

	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц начинается с 0
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');

	return `${day}.${month}.${year} at ${hours}:${minutes}`;
};

export const timeAgo = (dateStr?: string): string => {
	if (!dateStr) return '—';
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();

	const diffMinutes = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffMinutes < 1) return 'right now';
	if (diffMinutes < 60) return `${diffMinutes} min ago`;
	if (diffHours < 24) return `${diffHours} hour ago`;
	if (diffDays < 7) return `${diffDays} day ago`;

	return formatDateTime(dateStr); // если прошло больше 7 дней — покажем обычную дату
};

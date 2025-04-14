type animal = {
	[key: string]: Array<string>;
};
const animalTypes: animal = {
	'🐶 Dog': [
		'Labrador',
		'German Shepherd',
		'Poodle',
		'Bulldog',
		'French Bulldog'
	],
	'🐱 Cat': ['Sphynx', 'Maine Coon', 'Brittany']
	// '🐦 Bird': ['Попугай', 'Канарейка', 'Голубь'],
	// '🦎 Reptile': ['Ящерица', 'Черепаха', 'Змея'],

	// '🐹 Rodent': ['Хомяк', 'Мышь', 'Крыса'],
	// '🐾 Other': ['Попугай', 'Хомяк', 'Кролик'],
};

export default animalTypes;

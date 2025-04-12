export interface ApiResponse<T> {
	data: T;
	message?: string;
}

export interface PetFormState {
	type: string;
	breed: string;
	name: string;
	photo: string | null;
	gender: string;
	birthDate: string;
	weight: string;
	color: string;
	character: string[];
	activity: string[];
	petDescription: string;
	additionalNotes: string;
}
export interface Pet {
	id: number | 'add';
	name: string;
	breed?: string;
	species: string;
	age?: string;
	weight?: number;
	photo?: string;
	gender?: string;
	date_of_birth?: string | undefined;
	character?: string[];
	activity?: string[];
	petDescription?: string;
	additionalNotes?: string;
}

export interface Sitter {
	id: number | 'add';
	first_name: string;
	last_name: string;
	email: string;
	phone?: string;
	date_of_birth?: string;
	role?: string;
	isActivated?: boolean;
	description?: string;
	petTypes?: string[];
	completedOrdersCount: number;
	certificateUrl?: string;
	avatarUrl?: string;
	skills?: string[];
	location?: string[];
	created_at?: Date;
	updated_at?: Date;
}

export interface Order {
	id: number;
	startDate: string;
	endDate: string;
	careTime: string;
	services: string[];
	fee: number;
	status: 'pending' | 'accepted' | 'completed' | 'rejected';
	rating?: number;
	review?: string;
	updatedAt?: string;
	platformCommission?: number;
	pet: {
		id: number;
		name: string;
		species: string;
	};
	user: {
		id: number;
		first_name: string;
		last_name: string;
		phone: string;
	};
	sitter: {
		id: number;
		first_name: string;
		last_name: string;
		phone: string;
	};
}
export interface Review {
	id: number;
	rating: number;
	review: string;
	updatedAt: string;
	user: {
		first_name: string;
		last_name: string;
	};
}

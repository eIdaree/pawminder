export const calculateAge = (dateOfBirth: string | undefined) => {
	if (!dateOfBirth) {
		console.error('date_of_birth is undefined');
		return { years: 0, months: 0 };
	}
	const birthDate = new Date(dateOfBirth);
	const currentDate = new Date();
	let years = currentDate.getFullYear() - birthDate.getFullYear();
	let months = currentDate.getMonth() - birthDate.getMonth();

	if (months < 0) {
		years--;
		months += 12;
	}

	return { years, months };
};

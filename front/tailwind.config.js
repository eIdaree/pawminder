// tailwind.config.js
module.exports = {
	content: ['./components/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],

	theme: {
		extend: {
			fontFamily: {
				PoppinsRegular: ['Poppins-Regular', 'sans-serif'],
				PoppinsSemiBold: ['Poppins-SemiBold', 'sans-serif'],
				PoppinsBold: ['Poppins-Bold', 'sans-serif'],
				PoppinsMedium: ['Poppins-Medium', 'sans-serif'],
				InterRegular: ['Inter-Regular', 'sans-serif'],
				InterSemiBold: ['Inter-SemiBold', 'sans-serif'],
				InterBold: ['Inter-Bold', 'sans-serif'],
				InterMedium: ['Inter-Medium', 'sans-serif']
			},
			colors: {
				primary: '#674CFF',
				primaryLight: '#8A75FF',
				text: '#292D32',
				background: '#F7F7F7',
				secondary: '#EDF1F3',
				subtext: '#BEB8E3',
				darkgray: '#8D98AA',
				lightgray: '#D9DDDF'
			}
		}
	},
	plugins: []
};

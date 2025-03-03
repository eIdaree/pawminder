// tailwind.config.js
module.exports = {
    content: [
      './components/**/*.{js,ts,jsx,tsx}', // Путь до файлов с компонентами
      './app/**/*.{js,ts,jsx,tsx}', // Если у вас есть папка 'app'
    ],
    theme: {
      extend: {
        fontFamily: {
          PoppinsRegular: ['Poppins-Regular', 'sans-serif'],
          PoppinsSemiBold: ['Poppins-SemiBold', 'sans-serif'],
          Poppins: ["Poppins", "sans-serif"],
          PoppinsBold: ["Poppins-Bold", "sans-serif"],
          PoppinsExtraBold: ["Poppins-ExtraBold", "sans-serif"],
          PoppinsExtraLight: ["Poppins-ExtraLight", "sans-serif"],
          PoppinsLight: ["Poppins-Light", "sans-serif"],
          PoppinsMedium: ["Poppins-Medium", "sans-serif"],
        },
        colors: {
          primary: '#674CFF',
          primaryLight: '#8A75FF',
          text: '#292D32',
          background: '#F7F7F7',
          secondary: '#EDF1F3'
        }
      },
    },
    plugins: [],
  }
  
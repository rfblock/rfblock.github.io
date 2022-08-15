/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
		colors: {
			cyan: {
				DEFAULT: '#00e5ff'
			}
		}
	},
  },
  plugins: [],
}
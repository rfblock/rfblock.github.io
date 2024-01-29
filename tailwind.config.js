/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./index.html"],
  theme: {
    extend: {
		colors: {
			cyan: {
				DEFAULT: '#00e5ff'
			}
		},
	},
  },
  plugins: [],
}
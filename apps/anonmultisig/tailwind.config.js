/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		colors: {
			transparent: "transparent",
			white: colors.white,

			black: "#1F0F1C",
			orange: colors.orange,
			gray: colors.gray,
			...colors,
		},
		fontFamily: {
			main: ['"Space Grotesk"', "sans-serif"],
		},
		extend: {
			backgroundPosition: {
				"pos-0": "0% 0%",
				"pos-100": "100% 100%",
			},
			boxShadow: {
				main: "0px 4px 20px rgba(226, 172, 207, 0.3)",
			},
		},
	},
	plugins: [
		require("tailwindcss-debug-screens"),
		require("@tailwindcss/line-clamp"),
	],
};

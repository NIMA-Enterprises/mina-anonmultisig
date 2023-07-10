import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import headers from "vite-plugin-server-headers";
import tsconfigPaths from "vite-tsconfig-paths";

import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import nodePolyfills from "rollup-plugin-node-polyfills";
import { visualizer } from "rollup-plugin-visualizer";

const shouldAnalyze = process.env.ANALYZE ?? false;

// https://vitejs.dev/config/
export default defineConfig({
	esbuild: {
		logOverride: { "this-is-undefined-in-esm": "silent" },
	},
	plugins: [
		react(),
		tsconfigPaths({ projects: ["./tsconfig.json"] }),
		mkcert(),

		headers({
			"Cross-Origin-Opener-Policy": "same-origin",
			"Cross-Origin-Embedder-Policy": "require-corp",
		}),
	],

	preview: {
		port: 3000,
	},
	server: {
		port: 3000,
	},

	// worker: {
	// 	format: "es",
	// },

	optimizeDeps: {
		esbuildOptions: {
			target: "esnext",
			// Node.js global to browser globalThis
			define: {
				global: "globalThis",
			},
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true,
					process: true,
				}),
			],
		},
	},

	envPrefix: [
		"ANONMULTISIG_IS_PROD",
		"WALLET_CONNECTION_IS_PROD",
		"BACKEND_SERVICE_ANONMULTISIG_BASE_URL",
		"SIGN_SERVICE_APP_NAME",
	],

	build: {
		target: "esnext",
		outDir: "dist",
		rollupOptions: {
			plugins: [
				// https://stackoverflow.com/a/72978600
				// @ts-ignore Check link above for more details
				nodePolyfills(),
				// ...(!!shouldAnalyze
				// 	? [visualizer({ filename: "./dist/_stats.html" })]
				// 	: []),
			],
		},
		sourcemap: !!shouldAnalyze,
	},
	cacheDir: "./.cache",
	resolve: {
		alias: {
			"@components": resolve(__dirname, "src", "components"),
			"atoms": resolve(
				__dirname,
				"..",
				"..",
				"packages",
				"core",
				"ui",
				"atoms",
			),
			"molecules": resolve(
				__dirname,
				"..",
				"..",
				"packages",
				"core",
				"ui",
				"molecules",
			),
			"organisms": resolve(
				__dirname,
				"..",
				"..",
				"packages",
				"core",
				"ui",
				"organisms",
			),
			"utils": resolve(
				__dirname,
				"..",
				"..",
				"packages",
				"core",
				"utils",
			),
		},
	},
});

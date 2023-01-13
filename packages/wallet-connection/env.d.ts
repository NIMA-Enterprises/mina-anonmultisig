/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly WALLET_CONNECTION_IS_PROD: "true" | "false";
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly ANONMULTISIG_IS_PROD: string;
	readonly WALLET_CONNECTION_IS_PROD: string;
	readonly BACKEND_SERVICE_ANONMULTISIG_BASE_URL: string;
	readonly SIGN_SERVICE_APP_NAME: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

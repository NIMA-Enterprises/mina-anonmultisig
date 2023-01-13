/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly BACKEND_SERVICE_ORGANIZATIONS_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

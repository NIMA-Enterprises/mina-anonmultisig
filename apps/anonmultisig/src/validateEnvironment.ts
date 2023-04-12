import { z } from "zod";

const schema = z.object({
	ANONMULTISIG_IS_PROD: z.string(),
	WALLET_CONNECTION_IS_PROD: z.string(),
	BACKEND_SERVICE_ANONMULTISIG_BASE_URL: z.string(),
	SIGN_SERVICE_APP_NAME: z.string(),
});

const validateEnvironment = () => {
	schema.passthrough().parse(import.meta.env);
};

export { validateEnvironment };

import { z } from "zod";

const environmentSchema = z.object({
	WALLET_CONNECTION_IS_PROD: z.union([z.literal("true"), z.literal("false")]),
});

const validateEnvironment = () => {
	environmentSchema.passthrough().parse(import.meta.env);
};

export { validateEnvironment };

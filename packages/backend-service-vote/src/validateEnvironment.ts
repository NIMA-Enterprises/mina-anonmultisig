import { z } from "zod";

const schema = z.object({
	BACKEND_SERVICE_VOTE_BASE_URL: z.string(),
});

const validateEnvironment = () => {
	schema.passthrough().parse(import.meta.env);
};

export { validateEnvironment };
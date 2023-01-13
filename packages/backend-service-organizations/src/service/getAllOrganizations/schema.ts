import { z } from "zod";

const schema = z.object({
	status: z.string(),
	organizations: z.array(
		z.object({
			name: z.string(),
			description: z.string(),
			contractAddress: z.string(),
		}),
	),
});

export { schema };

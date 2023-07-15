import { z } from "zod";

const schema = z.object({
	status: z.string(),
	organisations: z.array(
		z.object({
			name: z.string(),
			description: z.string(),
			logoUrl: z.string(),
			contractAddress: z.string(),
		}),
	),
});

export { schema };

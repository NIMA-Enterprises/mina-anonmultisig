import { z } from "zod";

const schema = z.object({
	status: z.string(),
	organisation: z.object({
		name: z.string(),
		description: z.string(),
		logoUrl: z.string(),
		backgroundImageUrl: z.string().optional(),
	}),
});

export { schema };

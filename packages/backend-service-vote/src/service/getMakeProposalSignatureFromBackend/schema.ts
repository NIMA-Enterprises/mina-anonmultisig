import { z } from "zod";

const schema = z.object({
	status: z.string(),
	signature: z.object({
		r: z.string(),
		s: z.string(),
	}),
});

export { schema };
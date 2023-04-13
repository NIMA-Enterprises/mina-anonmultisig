import { z } from "zod";

const schema = z.object({
	status: z.string(),
	result: z.array(
		z.object({
			isLeft: z.boolean(),
			sibling: z.string(),
		}),
	),
});

export { schema };

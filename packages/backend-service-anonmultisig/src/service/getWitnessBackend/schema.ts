import { z } from "zod";

const schema = z.object({
	isLeft: z.array(z.boolean()),
	path: z.array(z.string()),
});

export { schema };

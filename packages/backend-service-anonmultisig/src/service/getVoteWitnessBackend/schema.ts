import { z } from "zod";

const schema = z.object({
	path: z.string(),
	value: z.string(),
});

export { schema };

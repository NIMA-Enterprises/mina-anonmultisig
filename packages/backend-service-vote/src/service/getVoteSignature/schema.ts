import { z } from "zod";

const schema = z.object({
	status: z.string(),
	signature: z.string(),
});

export { schema };

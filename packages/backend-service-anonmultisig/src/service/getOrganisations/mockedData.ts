import { schema } from "./schema";
import { z } from "zod";

const response1: z.infer<typeof schema> = {
	status: "ok",
	organisations: [
		{
			contractAddress:
				"B62qkyKizTdzSCdjsYtzrMcJTPcD2aZ4EpVoWosDGVFJ73hyKMoy4xi",
			name: "Test Org",
			description:
				"Every day, we give up control of intimate data to large tech companies to use online services. We give up control of our finances to banks and unaccountable credit bureaus. We give up control of our elections to voting system companies who run opaque and unauditable elections.",
			logoUrl:
				"https://avatars.githubusercontent.com/u/39103922?s=200&v=4",
		},
	],
};

export default { response1 };

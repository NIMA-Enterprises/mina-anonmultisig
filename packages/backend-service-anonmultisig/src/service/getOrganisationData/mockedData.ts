import { schema } from "./schema";
import { z } from "zod";

const response1: z.infer<typeof schema> = {
	status: "ok",
	organisation: {
		name: "Test Org",
		description:
			"Every day, we give up control of intimate data to large tech companies to use online services. We give up control of our finances to banks and unaccountable credit bureaus. We give up control of our elections to voting system companies who run opaque and unauditable elections.",
		logoUrl: "https://avatars.githubusercontent.com/u/39103922?s=200&v=4",
		backgroundImageUrl:
			"https://blockworks.co/_next/image?url=https://blockworks-co.imgix.net/wp-content/uploads/2022/03/Mina-blockchain.jpg&w=1920&q=75&webp=false",
	},
};

export default { response1 };

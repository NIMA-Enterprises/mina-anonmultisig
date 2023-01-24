import type { schema } from "./schema";
import type { z } from "zod";

type ModelType = z.infer<typeof schema>;

const createGetVoteSignatureResponseModel = (response: any): ModelType => {
	return response;
	return {
		status: response?.status ?? "",
		signature: response?.signature ?? "",
	};
};

export { createGetVoteSignatureResponseModel };

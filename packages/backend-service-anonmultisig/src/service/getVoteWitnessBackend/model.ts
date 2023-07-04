import type { schema } from "./schema";
import type { z } from "zod";

type ModelType = z.infer<typeof schema>;

const createGetMakeProposalWithessResponseModel = (
	response: any,
): ModelType => {
	return response;
	// return {
	// 	status: response?.status ?? "",
	// 	signature: response?.signature ?? "",
	// };
};

export { createGetMakeProposalWithessResponseModel };

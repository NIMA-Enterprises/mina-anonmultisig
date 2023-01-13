import mockedData from "./mockedData";
import { createGetVoteSignatureResponseModel } from "./model";
import { schema } from "./schema";
import { createRequestQueryFunction } from "query-function-creators";
import { signMessage } from "sign-service";

const getVoteSignature = createRequestQueryFunction({
	getAxiosRequestConfig: ({
		signature,
		userAddress,
		organizationId,
	}: {
		signature: Awaited<ReturnType<typeof signMessage>>;
		userAddress: string;
		organizationId: string;
	}) => ({
		// url: `${
		// 	import.meta.env.BACKEND_SERVICE_VOTE_BASE_URL
		// }/organization/${organizationId}`,
		url: "https://mina-web3.herokuapp.com/verify-message",
		method: "post",
		data: {
			signature,
			user_address: userAddress,
		},
	}),
	schema,
	model: createGetVoteSignatureResponseModel,
	getMockedData: () => mockedData.response1,
	isMockingEnabled: false,
});

declare global {
	interface Window {
		getVoteSignature: typeof getVoteSignature;
	}
}

window.getVoteSignature = getVoteSignature;

export { getVoteSignature };

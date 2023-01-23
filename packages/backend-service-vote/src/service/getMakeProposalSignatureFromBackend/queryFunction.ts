import mockedData from "./mockedData";
import { createGetVoteSignatureResponseModel } from "./model";
import { schema } from "./schema";
import { createRequestQueryFunction } from "query-function-creators";
import { signMessage } from "sign-service";

const getMakeProposalSignatureFromBackend = createRequestQueryFunction({
	getAxiosRequestConfig: ({
		signature,
		userAddress,
		message,
	}: {
		signature: Awaited<ReturnType<typeof signMessage>>;
		userAddress: string;
		message: string;
	}) => ({
		// url: `${
		// 	import.meta.env.BACKEND_SERVICE_VOTE_BASE_URL
		// }/organization/${organizationId}`,
		url: "https://mina-web3.herokuapp.com/verify-message",
		method: "post",
		data: {
			signature,
			user_address: userAddress,
			message,
		},
	}),
	schema,
	model: createGetVoteSignatureResponseModel,
	getMockedData: () => mockedData.response1,
	isMockingEnabled: false,
});

declare global {
	interface Window {
		getMakeProposalSignatureFromBackend: typeof getMakeProposalSignatureFromBackend;
	}
}

window.getMakeProposalSignatureFromBackend =
	getMakeProposalSignatureFromBackend;

export { getMakeProposalSignatureFromBackend };

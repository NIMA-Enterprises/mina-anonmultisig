import mockedData from "./mockedData";
import { createGetMakeProposalWithessResponseModel } from "./model";
import { schema } from "./schema";
import { createRequestQueryFunction } from "query-function-creators";

const getMakeProposalWitnessFromBackend = createRequestQueryFunction({
	getAxiosRequestConfig: ({
		membersAsTreeHash,
		memberSlot,
	}: {
		memberSlot: number;
		membersAsTreeHash: string[];
	}) => ({
		// url: `${
		// 	import.meta.env.BACKEND_SERVICE_VOTE_BASE_URL
		// }/organization/${organizationId}`,
		url: "https://mina-web3.herokuapp.com/witness",
		method: "post",
		data: {
			member_slot: memberSlot,
			members: membersAsTreeHash,
		},
	}),
	schema,
	model: createGetMakeProposalWithessResponseModel,
	getMockedData: () => mockedData.response1,
	isMockingEnabled: false,
});

declare global {
	interface Window {
		getMakeProposalWitnessFromBackend: typeof getMakeProposalWitnessFromBackend;
	}
}

window.getMakeProposalWitnessFromBackend = getMakeProposalWitnessFromBackend;

export { getMakeProposalWitnessFromBackend };

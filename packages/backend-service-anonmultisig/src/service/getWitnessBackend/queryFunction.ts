import mockedData from "./mockedData";
import { createGetMakeProposalWithessResponseModel } from "./model";
import { schema } from "./schema";
import {
	buildTree,
	generateMemberHash,
	getWitness,
} from "contract-service-anonmultisig/src/pure";
import { createRequestQueryFunction } from "query-function-creators";

const getWitnessBackend = createRequestQueryFunction({
	getAxiosRequestConfig: ({ memberAddress }: { memberAddress: string }) => ({
		url: `${import.meta.env.BACKEND_SERVICE_VOTE_BASE_URL}/witness`,
		method: "post",
	}),
	schema,
	model: createGetMakeProposalWithessResponseModel,
	getMockedData: async ({ memberAddress }) => {
		const { memberHash } = generateMemberHash({ address: memberAddress });

		const memberHashes = [
			"15498290784265734118549867675140481920882126543766521419782901480536780576651",
			"26606380939733954246583740718331481734349425354101789056907048547082028697199",
			"2167453380387771925174594421988550125935501591112495928843012012296676244736",
			"18403404975422813728128012111530850154068609400887699774712489263278958190813",
		];

		const memberSlot = memberHashes.findIndex((el) => el === memberHash);

		if (memberSlot === -1) {
			throw new Error(
				`Address ${memberAddress} is not part of this organization`,
			);
		}

		const { tree } = buildTree({ memberHashes });
		const { path } = await getWitness({ tree, memberSlot });

		return path;
	},
	isMockingEnabled: true,
});

declare global {
	interface Window {
		getWitnessBackend: typeof getWitnessBackend;
	}
}

window.getWitnessBackend = getWitnessBackend;

export { getWitnessBackend };

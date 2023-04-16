import mockedData from "./mockedData";
import { createGetMakeProposalWithessResponseModel } from "./model";
import { schema } from "./schema";
import {
	MyMerkleWitness,
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
			"27786589733633704612958905464736150309252271263215292495520663003876835652231",
			"18912330275273379416778032745642205832459522663926664699299799400101993516640",
			"6983273085396132813869016891633329893217382221722148972206827128290160879058",
			"18409659316376614128232859640621288344598681212266794919612725214271117942343",
		];

		const memberSlot = memberHashes.findIndex((el) => el === memberHash);

		if (memberSlot === -1) {
			throw new Error(
				`Address ${memberAddress} is not part of this organization`,
			);
		}

		const { tree } = buildTree({ memberHashes });
		const { path } = await getWitness({ tree, memberSlot });

		console.log({ memberHash, memberHashes, memberSlot, tree, path });

		return path.toJSON();
	},
	isMockingEnabled: true,
});

// declare global {
// 	interface Window {
// 		getWitnessBackend: typeof getWitnessBackend;
// 	}
// }

// window.getWitnessBackend = getWitnessBackend;

export { getWitnessBackend };

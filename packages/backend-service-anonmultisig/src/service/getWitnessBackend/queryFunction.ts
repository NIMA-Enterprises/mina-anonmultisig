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
			"15050448691488780176313275667944297343446067985266756144700269421325513365386",
			"20676510748447735041586105873474368415049987132205643812100397013565771881111",
			"24215322458122458510008067819704723617287510749883659676409238977062569016315",
			"24415789251416041555078218025171607049862384004319765906930925769612572152482",
		];

		const memberSlot = memberHashes.findIndex((el) => el === memberHash);

		if (memberSlot === -1) {
			throw new Error(
				`Address ${memberAddress} is not part of this organization`,
			);
		}

		const { tree } = buildTree({ memberHashes });
		const { path } = await getWitness({ tree, memberSlot });

		return path.toJSON();
	},
	isMockingEnabled: true,
});

export { getWitnessBackend };

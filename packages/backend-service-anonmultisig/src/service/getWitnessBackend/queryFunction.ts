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
			"8298289351944932411078148006841740675898361523651687396950267348964711494355",
			"14209301871868611175221925010693545631555223286582657976060842111744398605213",
			"5945466731886651520626880329785903980885442507529891623966413003429307217342",
			"7680458304331471879098196773796832396318016750095618337255041046821645929487",
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

export { getWitnessBackend };

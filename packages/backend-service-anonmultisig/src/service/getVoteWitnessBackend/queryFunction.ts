import { createGetMakeProposalWithessResponseModel } from "./model";
import { schema } from "./schema";
import {
	buildMap,
	generateMemberHash,
} from "contract-service-anonmultisig/src/pure";
import { createRequestQueryFunction } from "query-function-creators";
import { Field } from "snarkyjs";

const getVoteWitnessBackend = createRequestQueryFunction({
	getAxiosRequestConfig: ({ memberAddress }: { memberAddress: string }) => ({
		url: `${import.meta.env.BACKEND_SERVICE_VOTE_BASE_URL}/witness`,
		method: "post",
	}),
	schema,
	model: createGetMakeProposalWithessResponseModel,
	getMockedData: async ({ memberAddress }) => {
		const { memberHash } = generateMemberHash({ address: memberAddress });

		const initializationObject: Parameters<typeof buildMap>["0"] = {
			memberHashes: [
				{
					memberHash:
						"8298289351944932411078148006841740675898361523651687396950267348964711494355",
					vote: 0,
				},
				{
					memberHash:
						"14209301871868611175221925010693545631555223286582657976060842111744398605213",
					vote: 0,
				},
				{
					memberHash:
						"5945466731886651520626880329785903980885442507529891623966413003429307217342",
					vote: 0,
				},
				{
					memberHash:
						"7680458304331471879098196773796832396318016750095618337255041046821645929487",
					vote: 0,
				},
			],
		};

		const memberHashes = initializationObject.memberHashes.map(
			({ memberHash }) => memberHash,
		);

		const memberSlot = memberHashes.findIndex((el) => el === memberHash);

		if (memberSlot === -1) {
			throw new Error(
				`Address ${memberAddress} is not part of this organization`,
			);
		}

		const { map } = buildMap(initializationObject);
		const value = map.get(Field.fromJSON(memberHash));
		const path = map.getWitness(Field.fromJSON(memberHash));

		return {
			path: path.toJSON(),
			value: value.toJSON(),
		};
	},
	isMockingEnabled: true,
});

export { getVoteWitnessBackend };

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
						"17210616284879241761904327430466852663812125151986158320985254051586695168233",
					vote: 0,
				},
				{
					memberHash:
						"19207964606337410758909615829482604487113996387703310047243610093104441110538",
					vote: 0,
				},
				{
					memberHash:
						"21608735000319309557238874841085318243251227641390145445111722751232785120496",
					vote: 0,
				},
				{
					memberHash:
						"4183447149109957221010024735472944265708398195613225096041405203417417745683",
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

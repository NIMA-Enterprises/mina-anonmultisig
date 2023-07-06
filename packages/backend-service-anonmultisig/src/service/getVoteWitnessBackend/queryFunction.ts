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
						"11106149484473217251416813003811887797254571587052529890538575267144459303443",
					vote: 0,
				},
				{
					memberHash:
						"14200697873895277488154401846339652019282481790764357188408309381560444133344",
					vote: 0,
				},
				{
					memberHash:
						"2926944278442055839918853870523770833840844338291291303358089535501165285189",
					vote: 0,
				},
				{
					memberHash:
						"17570309296069270105480279893245611455833280352879357390335602049878303605373",
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

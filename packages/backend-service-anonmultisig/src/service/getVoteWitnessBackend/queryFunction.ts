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
	getMockedData: async ({ memberAddress }) => {
		const { memberHash } = generateMemberHash({ address: memberAddress });

		const initializationObject: Parameters<typeof buildMap>["0"] = {
			memberHashes: [
				{
					memberHash:
						"15050448691488780176313275667944297343446067985266756144700269421325513365386",
					vote: 1,
				},
				{
					memberHash:
						"20676510748447735041586105873474368415049987132205643812100397013565771881111",
					vote: 0,
				},
				{
					memberHash:
						"24215322458122458510008067819704723617287510749883659676409238977062569016315",
					vote: 0,
				},
				{
					memberHash:
						"24415789251416041555078218025171607049862384004319765906930925769612572152482",
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

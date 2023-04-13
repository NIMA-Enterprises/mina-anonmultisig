import { makeProposal } from "../service";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getWitnessBackend } from "backend-service-anonmultisig";
import { buildTree } from "contract-service-anonmultisig/src/pure";
import {
	generateMessageHash,
	readStateFields,
	reset,
} from "contract-service-anonmultisig/src/workerized";
import { getEndpointCreators } from "get-endpoint-creators";

window.readStateFields = readStateFields;
window.reset = reset;
window.generateMessageHash = generateMessageHash;
window.builtTree = buildTree;
window.makeProposal = makeProposal;
window.getWitnessBackend = getWitnessBackend;

const anonmultisigBusinessLogicApi = createApi({
	reducerPath: "anonmultisigBusinessLogicApi",
	baseQuery: fakeBaseQuery(),
	endpoints: (builder) => {
		const { createQuery, createMutation } = getEndpointCreators(builder);

		return {};
	},
});

export { anonmultisigBusinessLogicApi };

// export const {} = anonmultisigBusinessLogicApi;

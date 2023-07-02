import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getWitnessBackend } from "backend-service-anonmultisig";
import {
	MyMerkleWitness,
	buildTree,
	generateMemberHash,
	generateMessageHash, // makeProposal,
	// readStateFields,
	generateProposalHash,
	getWitness,
	makeProposal,
	readStateFields,
	reset,
} from "contract-service-anonmultisig/src/workerized";
import { getEndpointCreators } from "get-endpoint-creators";

window.readStateFields = readStateFields;
window.reset = reset;
window.generateMessageHash = generateMessageHash;
window.makeProposal = makeProposal;
// window.buildTree = buildTree;
// window.getWitnessBackend = getWitnessBackend;
// window.generateMemberHash = generateMemberHash;
// window.generateProposalHash = generateProposalHash;
// window.getWitness = getWitness;
// window.MyMerkleWitness = MyMerkleWitness;

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

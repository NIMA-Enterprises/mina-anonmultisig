import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getWitnessBackend } from "backend-service-anonmultisig";
import { buildMap } from "contract-service-anonmultisig/src/pure";
import {
	MyMerkleWitness,
	buildTree,
	cancel,
	execute,
	generateMemberHash,
	generateMessageHash, // makeProposal,
	// readStateFields,
	generateProposalHash,
	generateVoteMessageHash,
	getWitness,
	makeProposal,
	readStateFields,
	reset,
	vote,
} from "contract-service-anonmultisig/src/workerized";
import { getEndpointCreators } from "get-endpoint-creators";

window.readStateFields = readStateFields;
window.reset = reset;
window.generateMessageHash = generateMessageHash;
window.generateVoteMessageHash = generateVoteMessageHash;
window.makeProposal = makeProposal;
window.vote = vote;
window.execute = execute;
window.cancel = cancel;
window.buildMap = buildMap;
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

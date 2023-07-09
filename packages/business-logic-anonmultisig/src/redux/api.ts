import * as makeProposal from "contract-service-anonmultisig/src/workerized/makeProposal";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEndpointCreators } from "get-endpoint-creators";
import { waitForAccountChange } from "wallet-connection";

const anonmultisigBusinessLogicApi = createApi({
	reducerPath: "anonmultisigBusinessLogicApi",
	baseQuery: fakeBaseQuery(),
	endpoints: (builder) => {
		const { createQuery, createMutation } = getEndpointCreators(builder);

		return {
			makeProposalStep1: createMutation(
				makeProposal.step1.generateMessageHash,
			),
			makeProposalStep2: createMutation(makeProposal.step2.signMessage),
			makeProposalStep3: createMutation(
				makeProposal.step3.generateTxProof,
			),
			makeProposalStep4: createMutation(makeProposal.step4.sendTx),
			waitForAccountChange: createMutation(waitForAccountChange),
		};
	},
});

export { anonmultisigBusinessLogicApi };

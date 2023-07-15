import * as makeProposal from "contract-service-anonmultisig/src/workerized/makeProposal";
import { loadImage, loadMultipleImages } from "../service";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
	getOrganisationData,
	getOrganisations,
} from "backend-service-anonmultisig";
import {
	createAnonMultiSigContract,
	getAccountBalance,
	isAddressMemberOfOrganisation,
} from "contract-service-anonmultisig/src/pure";
// import { buildMap } from "contract-service-anonmultisig/src/pure";
import { cancel } from "contract-service-anonmultisig/src/workerized/cancel";
import { countVotes } from "contract-service-anonmultisig/src/workerized/countVotes";
import { execute } from "contract-service-anonmultisig/src/workerized/execute";
import { readStateFields } from "contract-service-anonmultisig/src/workerized/readStateFields";
import { vote } from "contract-service-anonmultisig/src/workerized/vote";
import { getEndpointCreators } from "get-endpoint-creators";
import { waitForAccountChange } from "wallet-connection";

window.createAnonMultiSigContract = createAnonMultiSigContract;

// window.buildMap = buildMap;

const anonmultisigBusinessLogicApi = createApi({
	reducerPath: "anonmultisigBusinessLogicApi",
	baseQuery: fakeBaseQuery(),
	endpoints: (builder) => {
		const { createQuery, createMutation } = getEndpointCreators(builder);

		return {
			isAddressMemberOfOrganisation: createQuery(
				isAddressMemberOfOrganisation,
			),
			readStateFields: createQuery(readStateFields),
			accountBalance: createQuery(getAccountBalance),
			countVotes: createQuery(countVotes),
			waitForAccountChange: createMutation(waitForAccountChange),
			makeProposalStep1: createMutation(
				makeProposal.step1.generateMessageHash,
			),
			makeProposalStep2: createMutation(makeProposal.step2.signMessage),
			makeProposalStep3: createMutation(
				makeProposal.step3.generateTxProof,
			),
			makeProposalStep4: createMutation(makeProposal.step4.sendTx),
			voteStep1: createMutation(vote.step1.generateVoteMessageHash),
			voteStep2: createMutation(vote.step2.signMessage),
			voteStep3: createMutation(vote.step3.generateTxProof),
			voteStep4: createMutation(vote.step4.sendTx),
			executeStep1: createMutation(
				execute.step1.generateExecuteMessageHash,
			),
			executeStep2: createMutation(execute.step2.signMessage),
			executeStep3: createMutation(execute.step3.generateTxProof),
			executeStep4: createMutation(execute.step4.sendTx),
			cancelStep1: createMutation(cancel.step1.generateCancelMessageHash),
			cancelStep2: createMutation(cancel.step2.signMessage),
			cancelStep3: createMutation(cancel.step3.generateTxProof),
			cancelStep4: createMutation(cancel.step4.sendTx),

			// backend
			organisationData: createQuery(getOrganisationData),
			getOrganisations: createQuery(getOrganisations),

			// soft image loading
			loadImage: createQuery(loadImage),
			loadMultipleImages: createQuery(loadMultipleImages),
		};
	},
});

export { anonmultisigBusinessLogicApi };

export const {
	useReadStateFieldsQuery,
	useCountVotesQuery,
	useOrganisationDataQuery,
	useAccountBalanceQuery,
	useLoadImageQuery,
	useLoadMultipleImagesQuery,
	useIsAddressMemberOfOrganisationQuery,
	useGetOrganisationsQuery,
} = anonmultisigBusinessLogicApi;

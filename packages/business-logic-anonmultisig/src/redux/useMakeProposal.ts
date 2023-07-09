import React from "react";

import { anonmultisigBusinessLogicApi } from "./api";

const useMakeProposal = () => {
	const [generateMessageHash, generateMessageHashMutationObj] =
		anonmultisigBusinessLogicApi.useMakeProposalStep1Mutation();
	const [signMessage, signMessageMutationObj] =
		anonmultisigBusinessLogicApi.useMakeProposalStep2Mutation();
	const [generateTxProof, generateTxProofMutationObj] =
		anonmultisigBusinessLogicApi.useMakeProposalStep3Mutation();
	const [sendTx, sendTxMutationObj] =
		anonmultisigBusinessLogicApi.useMakeProposalStep4Mutation();
	const [waitForAccountChange, waitForAccountChangeMutationObj] =
		anonmultisigBusinessLogicApi.useWaitForAccountChangeMutation();

	const steps = [
		{
			name: "Generate message hash" as const,
			isLoading: generateMessageHashMutationObj.isLoading,
			isUninitialized: generateMessageHashMutationObj.isUninitialized,
			isSuccess: generateMessageHashMutationObj.isSuccess,
			isError: generateMessageHashMutationObj.isError,
		},
		{
			name: "Sign message" as const,
			isLoading: signMessageMutationObj.isLoading,
			isUninitialized: signMessageMutationObj.isUninitialized,
			isSuccess: signMessageMutationObj.isSuccess,
			isError: signMessageMutationObj.isError,
		},
		{
			name: "Wait for wallet change" as const,
			isLoading: waitForAccountChangeMutationObj.isLoading,
			isUninitialized: waitForAccountChangeMutationObj.isUninitialized,
			isSuccess: waitForAccountChangeMutationObj.isSuccess,
			isError: waitForAccountChangeMutationObj.isError,
		},
		{
			name: "Generate transaction proof" as const,
			isLoading: generateTxProofMutationObj.isLoading,
			isUninitialized: generateTxProofMutationObj.isUninitialized,
			isSuccess: generateTxProofMutationObj.isSuccess,
			isError: generateTxProofMutationObj.isError,
		},
		{
			name: "Send transaction" as const,
			isLoading: sendTxMutationObj.isLoading,
			isUninitialized: sendTxMutationObj.isUninitialized,
			isSuccess: sendTxMutationObj.isSuccess,
			isError: sendTxMutationObj.isError,
		},
	];

	const f = async ({
		contractAddress,
		receiverAddress,
		amount,
	}: typeof anonmultisigBusinessLogicApi["endpoints"]["makeProposalStep1"]["Types"]["QueryArg"]) => {
		const { messageHash } = await generateMessageHash({
			contractAddress,
			receiverAddress,
			amount,
		}).unwrap();

		const { signatureAsBase58 } = await signMessage({
			messageHash,
		}).unwrap();

		const { memberAddress, feePayerAddress } = await waitForAccountChange(
			undefined,
		).unwrap();

		const { proof } = await generateTxProof({
			contractAddress,
			receiverAddress,
			amount,
			memberAddress,
			feePayerAddress,
			signatureAsBase58,
		}).unwrap();

		const { hash } = await sendTx({
			proof,
		}).unwrap();

		return {
			txUrl: `https://berkeley.minaexplorer.com/transaction/${hash}`,
		};
	};

	return { makeProposal: f, steps };
};

export { useMakeProposal };

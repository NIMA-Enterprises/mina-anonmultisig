/* eslint-disable @typescript-eslint/no-shadow */
import React from "react";

import { anonmultisigBusinessLogicApi } from "./api";

const useVote = () => {
	const [generateMessageHash, generateMessageHashMutationObj] =
		anonmultisigBusinessLogicApi.useVoteStep1Mutation({
			fixedCacheKey: "useVoteStep1Mutation",
		});
	const [signMessage, signMessageMutationObj] =
		anonmultisigBusinessLogicApi.useVoteStep2Mutation({
			fixedCacheKey: "useVoteStep2Mutation",
		});
	const [generateTxProof, generateTxProofMutationObj] =
		anonmultisigBusinessLogicApi.useVoteStep3Mutation({
			fixedCacheKey: "useVoteStep3Mutation",
		});
	const [sendTx, sendTxMutationObj] =
		anonmultisigBusinessLogicApi.useVoteStep4Mutation({
			fixedCacheKey: "useVoteStep4Mutation",
		});
	const [waitForAccountChange, waitForAccountChangeMutationObj] =
		anonmultisigBusinessLogicApi.useWaitForAccountChangeMutation({
			fixedCacheKey: "useWaitForAccountChangeMutation",
		});

	React.useEffect(() => {
		return () => {
			generateMessageHashMutationObj.reset();
			signMessageMutationObj.reset();
			generateTxProofMutationObj.reset();
			sendTxMutationObj.reset();
			waitForAccountChangeMutationObj.reset();
		};
	}, []);

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

	const isSuccess = steps.every(({ isSuccess }) => isSuccess);
	const isError = steps.some(({ isError }) => isError);
	const error =
		generateMessageHashMutationObj.error ||
		signMessageMutationObj.error ||
		waitForAccountChangeMutationObj.error ||
		generateTxProofMutationObj.error ||
		sendTxMutationObj.error;
	const isLoading = steps.some(({ isLoading }) => isLoading);
	const isUninitialized = steps.every(
		({ isUninitialized }) => isUninitialized,
	);

	const statusFlags = {
		isSuccess,
		isError: !isSuccess && isError,
		error,
		isLoading: !isSuccess && !isError && isLoading,
		isUninitialized:
			!isSuccess && !isError && !isLoading && isUninitialized,
	};

	const f = async ({
		contractAddress,
		isUpVote,
	}: typeof anonmultisigBusinessLogicApi["endpoints"]["voteStep1"]["Types"]["QueryArg"]) => {
		const { messageHash } = await generateMessageHash({
			contractAddress,
			isUpVote,
		}).unwrap();

		const { signatureAsBase58 } = await signMessage({
			messageHash,
		}).unwrap();

		const { memberAddress, feePayerAddress } = await waitForAccountChange(
			undefined,
		).unwrap();

		const { proof } = await generateTxProof({
			contractAddress,
			isUpVote,
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

	return { vote: f, steps, ...statusFlags };
};

export { useVote };

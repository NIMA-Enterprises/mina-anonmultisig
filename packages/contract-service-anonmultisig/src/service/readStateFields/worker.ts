import { createAnonMultiSigContract } from "../../createAnonMultiSigContract";
import { expose } from "comlink";

const readContract = async ({
	contractAddress,
}: {
	contractAddress: string;
}) => {
	const { zkAppInstance } = await createAnonMultiSigContract({
		contractAddress,
		skipCompile: true,
	});

	const membersTreeRoot = zkAppInstance.membersTreeRoot.get().toJSON();
	const minimalQuorum = zkAppInstance.minimalQuorum.get().toJSON();
	const proposalId = zkAppInstance.proposalId.get().toJSON();
	const proposalHash = zkAppInstance.proposalHash.get().toJSON();
	const voteActionsHash = zkAppInstance.voteActionsHash.get().toJSON();

	return {
		membersTreeRoot,
		minimalQuorum,
		proposalId,
		proposalHash,
		voteActionsHash,
	};
};

const worker = {
	readContract,
};

export type ReadContractType = typeof worker;

expose(worker);

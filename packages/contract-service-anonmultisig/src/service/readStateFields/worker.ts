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

	const admin = zkAppInstance.admin.get().toJSON();
	const membersTreeRoot = zkAppInstance.membersTreeRoot.get().toJSON();
	const numberOfMembers = zkAppInstance.numberOfMembers.get().toJSON();
	const minimalQuorum = zkAppInstance.minimalQuorum.get().toJSON();
	const proposalId = zkAppInstance.proposalId.get().toJSON();
	const proposalHash = zkAppInstance.proposalHash.get().toJSON();
	const proposalVotes = zkAppInstance.proposalVotes.get().toJSON();

	return {
		admin,
		membersTreeRoot,
		numberOfMembers,
		minimalQuorum,
		proposalId,
		proposalHash,
		proposalVotes,
	};
};

const worker = {
	readContract,
};

export type ReadContractType = typeof worker;

expose(worker);

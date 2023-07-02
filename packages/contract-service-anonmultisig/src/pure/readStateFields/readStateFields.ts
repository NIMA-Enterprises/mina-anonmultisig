import { createAnonMultiSigContract } from "../createAnonMultiSigContract";

const readStateFields = async ({
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
	const voteActionState = zkAppInstance.voteActionState.get().toJSON();

	return {
		membersTreeRoot,
		minimalQuorum,
		proposalId,
		proposalHash,
		voteActionState,
	};
};

export { readStateFields };

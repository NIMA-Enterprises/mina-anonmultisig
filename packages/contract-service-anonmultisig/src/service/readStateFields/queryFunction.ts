import { createAnonMultiSigContract } from "../../createAnonMultiSigContract";

const readStateFields = async ({
	contractAddress,
}: {
	contractAddress: string;
}) => {
	const { zkAppInstance } = await createAnonMultiSigContract({
		contractAddress,
	});

	const admin = zkAppInstance.admin.get();
	const membersTreeRoot = zkAppInstance.membersTreeRoot.get();
	const numberOfMembers = zkAppInstance.numberOfMembers.get();
	const minimalQuorum = zkAppInstance.minimalQuorum.get();
	const proposalId = zkAppInstance.proposalId.get();
	const proposalHash = zkAppInstance.proposalHash.get();
	const proposalVotes = zkAppInstance.proposalVotes.get();

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

declare global {
	interface Window {
		readStateFields: typeof readStateFields;
	}
}

window.readStateFields = readStateFields;

export { readStateFields };

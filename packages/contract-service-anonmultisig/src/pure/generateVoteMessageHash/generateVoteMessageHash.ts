import { createAnonMultiSigContract } from "../createAnonMultiSigContract";
import { CircuitString, Field, Poseidon } from "snarkyjs";

const generateVoteMessageHash = async ({
	contractAddress,
	isUpVote,
}: {
	contractAddress: string;
	isUpVote: boolean;
}) => {
	const { zkAppInstance, zkAppAddress } = await createAnonMultiSigContract({
		contractAddress,
		skipCompile: true,
	});

	const vote = Field(isUpVote ? 1 : 2);

	const proposalId = zkAppInstance.proposalId.get();

	const messageHash = Poseidon.hash([
		vote,
		proposalId,
		...CircuitString.fromString("vote").toFields(),
		...zkAppAddress.toFields(),
	]).toJSON();

	return {
		messageHash,
	};
};

export { generateVoteMessageHash };

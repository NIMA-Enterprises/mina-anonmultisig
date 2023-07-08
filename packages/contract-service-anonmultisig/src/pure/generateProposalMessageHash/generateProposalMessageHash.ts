import { createAnonMultiSigContract } from "../createAnonMultiSigContract";
import { generateProposalHash } from "../generateProposalHash";
import { CircuitString, Poseidon } from "snarkyjs";

const generateProposalMessageHash = async ({
	contractAddress,
	receiverAddress,
	amount,
}: {
	contractAddress: string;
	receiverAddress: string;
	amount: number;
}) => {
	const { zkAppInstance, zkAppAddress } = await createAnonMultiSigContract({
		contractAddress,
		skipCompile: true,
	});

	const { proposalHash } = generateProposalHash({
		receiverAddress,
		amount,
	});

	const proposalId = zkAppInstance.proposalId.get();

	const messageHash = Poseidon.hash([
		proposalHash,
		proposalId.add(1),
		...CircuitString.fromString("propose").toFields(),
		...zkAppAddress.toFields(),
	]).toJSON();

	return {
		messageHash,
	};
};

export { generateProposalMessageHash };

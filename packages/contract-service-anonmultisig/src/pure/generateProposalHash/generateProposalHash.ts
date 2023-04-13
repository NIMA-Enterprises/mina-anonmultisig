import { Poseidon, PublicKey, UInt64 } from "snarkyjs";

const generateProposalHash = ({
	receiverAddress,
	amount,
}: {
	receiverAddress: string;
	amount: number;
}) => {
	const proposalHash = Poseidon.hash([
		...PublicKey.fromBase58(receiverAddress).toFields(),
		...UInt64.from(amount).toFields(),
	]);

	return {
		proposalHash,
	};
};

export { generateProposalHash };

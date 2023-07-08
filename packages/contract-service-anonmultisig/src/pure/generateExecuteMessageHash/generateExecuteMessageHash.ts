import { createAnonMultiSigContract } from "../createAnonMultiSigContract";
import { CircuitString, Poseidon } from "snarkyjs";

const generateExecuteMessageHash = async ({
	contractAddress,
}: {
	contractAddress: string;
}) => {
	const { zkAppInstance, zkAppAddress } = await createAnonMultiSigContract({
		contractAddress,
		skipCompile: true,
	});

	const proposalId = zkAppInstance.proposalId.get();

	const messageHash = Poseidon.hash([
		proposalId,
		...CircuitString.fromString("execute").toFields(),
		...zkAppAddress.toFields(),
	]).toJSON();

	return {
		messageHash,
	};
};

export { generateExecuteMessageHash };

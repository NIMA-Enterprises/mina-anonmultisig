import { createAnonMultiSigContract } from "../../createAnonMultiSigContract";
import { expose } from "comlink";
import { CircuitString, Field, Poseidon, PublicKey, UInt64 } from "snarkyjs";

const generateMessageHash = async ({
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
	});

	const receiver = PublicKey.fromBase58(receiverAddress);

	const proposalHash: Field = Poseidon.hash([
		...receiver.toFields(),
		...UInt64.from(amount).toFields(),
	]);

	const proposalId: Field = zkAppInstance.proposalId.get();

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

const worker = {
	generateMessageHash,
};

export type GenerateMessageHashType = typeof worker;

expose(worker);

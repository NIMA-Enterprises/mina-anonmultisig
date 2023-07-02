import { createAnonMultiSigContract } from "../../pure";
import { Ready } from "../spawn";
import { expose } from "comlink";
import { Mina, PublicKey } from "snarkyjs";

const generateTransactionProof = async ({
	contractAddress,
	senderAddress,
}: {
	contractAddress: string;
	senderAddress: string;
}) => {
	const { zkAppInstance } = await createAnonMultiSigContract({
		contractAddress,
	});

	const txn = await Mina.transaction(
		{
			sender: PublicKey.fromBase58(senderAddress),
			fee: 100_000_000,
			memo: "Frontend App Reset",
		},
		() => {
			zkAppInstance.reset();
		},
	);

	await txn.prove();

	return {
		proof: txn.toJSON(),
	};
};

const worker = {
	generateTransactionProof,
};

export type GenerateTransactionProofType = typeof worker;

expose(worker);
postMessage(Ready);

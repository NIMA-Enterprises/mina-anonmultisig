import { createAnonMultiSigContract } from "../../createAnonMultiSigContract";
import { expose } from "comlink";
import { Mina } from "snarkyjs";

const generateTransactionProof = async () => {
	console.log(new Date());

	console.log("Start creating contract. This can take a while. Please wait.");
	const { zkAppInstance } = await createAnonMultiSigContract({
		contractAddress:
			"B62qppADTWBiiQZMxhejakZ6Vbog4tFZNsTM7bPiZ3UzSBwzNZhD81r",
	});
	console.log("Contract created");
	console.log({ zkAppInstance });
	console.log(new Date());

	console.log("Start creating Mina.transaction");

	const txn = await Mina.transaction(() => zkAppInstance.reset());
	console.log("Mina.transaction created");
	console.log({ txn });
	console.log(new Date());

	console.log(
		"Start creating transaction proof. This can take a while. Please wait.",
	);
	await txn.prove();
	console.log("Proof created");
	console.log({ txn, json: txn.toJSON() });
	console.log(new Date());

	return {
		proof: txn.toJSON(),
	};
};

const worker = {
	generateTransactionProof,
};

export type GenerateTransactionProofType = typeof worker;

expose(worker);

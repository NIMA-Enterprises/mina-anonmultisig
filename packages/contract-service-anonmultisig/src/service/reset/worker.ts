import { createAnonMultiSigContract } from "../../createAnonMultiSigContract";
import { expose } from "comlink";
import { Mina, PrivateKey } from "snarkyjs";

const generateTransactionProof = async (PRIVATE_KEY: string) => {
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

	const privateKey = PrivateKey.fromBase58(PRIVATE_KEY);

	const txn = await Mina.transaction(
		{
			sender: privateKey.toPublicKey(),
			fee: 100_000_000,
			// memo: "reset from frontend",
		},
		() => zkAppInstance.reset(),
	);
	console.log("Mina.transaction created");
	console.log({ txn });
	console.log(new Date());

	console.log(
		"Start creating transaction proof. This can take a while. Please wait.",
	);
	await txn.prove();
	console.log("Proof created");
	console.log({
		txn,
		"txn.toJSON()": txn.toJSON(),
		"txn.toPretty()": txn.toPretty(),
		"txn.toGraphqlQuery()": txn.toGraphqlQuery(),
	});
	console.log(new Date());

	console.log({
		PRIVATE_KEY,
	});

	console.log("1");

	txn.sign([privateKey]);

	console.log("2");
	console.log({
		txn,
		"txn.toJSON()": txn.toJSON(),
		"txn.toPretty()": txn.toPretty(),
		"txn.toGraphqlQuery()": txn.toGraphqlQuery(),
	});

	const result = await txn.send();
	console.log("3");
	// await result.wait();
	console.log("4");
	console.log({
		result,
		url: `https://berkeley.minaexplorer.com/transaction/${result.hash}`,
	});

	return {
		proof: txn.toJSON(),
	};
};

const worker = {
	generateTransactionProof,
};

export type GenerateTransactionProofType = typeof worker;

expose(worker);

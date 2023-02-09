import { createAnonMultiSigContract } from "../../createAnonMultiSigContract";
import { expose } from "comlink";
import { Mina, PrivateKey } from "snarkyjs";

const generateTransactionProof = async (PRIVATE_KEY: string) => {
	const { zkAppInstance } = await createAnonMultiSigContract({
		contractAddress:
			"B62qpq3MiDt2xYV8xxfQfMiuhZ7A2Ts9NBPYeQLbQkHr2KT8HY3sF8o",
	});

	const privateKey = PrivateKey.fromBase58(PRIVATE_KEY);

	const txn = await Mina.transaction(
		{
			sender: privateKey.toPublicKey(),
			fee: 100_000_000,
			memo: "Frontend App Reset",
		},
		() => {
			zkAppInstance.reset();
		},
	);

	await txn.prove();

	txn.sign([privateKey]);

	const result = await txn.send();

	return {
		proof: txn.toJSON(),
		txUrl: `https://berkeley.minaexplorer.com/transaction/${result.hash()}`,
	};
};

const worker = {
	generateTransactionProof,
};

export type GenerateTransactionProofType = typeof worker;

expose(worker);

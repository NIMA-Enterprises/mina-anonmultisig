import { createAnonMultiSigContract } from "../../createAnonMultiSigContract";
import type MinaProvider from "@aurowallet/mina-provider";
import { Field, Mina } from "snarkyjs";
import { wagmiClient } from "wallet-connection";

const reset = async () => {
	console.log(new Date());

	console.log("Start creating contract. This can take a while. Please wait.");
	const { zkAppInstance } = await createAnonMultiSigContract();
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

	console.log("Wallet transaction started");
	const provider =
		(await wagmiClient.connector?.getProvider()) as MinaProvider;
	console.log({ provider });

	const { hash } = await provider.sendTransaction({
		transaction: txn.toJSON(),
	});

	console.log("Wallet transaction finished");
	console.log({
		hash,
		url: `https://berkeley.minaexplorer.com/transaction/${hash}`,
	});
};

declare global {
	interface Window {
		reset: typeof reset;
	}
}

window.reset = reset;

export { reset };

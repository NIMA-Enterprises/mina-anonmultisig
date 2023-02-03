import * as snarkyjs from "snarkyjs";
import { GenerateTransactionProofType } from "./worker";
import type MinaProvider from "@aurowallet/mina-provider";
import { wrap } from "comlink";
import { MerkleWitness } from "snarkyjs";
import { wagmiClient } from "wallet-connection";

window.snarkyjs = snarkyjs;

class MyMerkleWitness extends MerkleWitness(8) {}
window.MyMerkleWitness = MyMerkleWitness;

const makeProposal = async (
	...args: Parameters<
		GenerateTransactionProofType["generateTransactionProof"]
	>
) => {
	console.log({
		where: "makeProposal",
		calledWith: {
			...args,
		},
	});

	const { generateTransactionProof } = wrap<GenerateTransactionProofType>(
		new Worker(new URL("./worker.ts", import.meta.url), {
			name: "generateTransactionProof_makeProposal",
			type: "module",
		}),
	);

	const { proof } = await generateTransactionProof(...args);

	console.log("Wallet transaction started");
	const provider =
		(await wagmiClient.connector?.getProvider()) as MinaProvider;
	console.log({ provider });

	const { hash } = await provider.sendTransaction({
		transaction: proof,
	});

	console.log("Wallet transaction finished");
	console.log({
		hash,
		url: `https://berkeley.minaexplorer.com/transaction/${hash}`,
	});
};

// declare global {
// 	interface Window {
// 		makeProposal: typeof makeProposal;
// 	}
// }

// window.makeProposal = makeProposal;

export { makeProposal };

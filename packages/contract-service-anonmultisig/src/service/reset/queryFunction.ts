import { GenerateTransactionProofType } from "./worker";
import type MinaProvider from "@aurowallet/mina-provider";
import { wrap } from "comlink";
import { wagmiClient } from "wallet-connection";

const reset = async () => {
	const worker = new Worker(new URL("./worker.ts", import.meta.url), {
		name: "generateTransactionProof_reset",
		type: "module",
	});
	const { generateTransactionProof } =
		wrap<GenerateTransactionProofType>(worker);

	const { proof, txUrl } = await generateTransactionProof(window.PRIVATE_KEY);

	worker.terminate();

	// console.log("Wallet transaction started");
	// const provider =
	// 	(await wagmiClient.connector?.getProvider()) as MinaProvider;
	// console.log({ provider });

	// const { hash } = await provider.sendTransaction({
	// 	transaction: proof,
	// });

	// console.log("Wallet transaction finished");
	// console.log({
	// 	hash,
	// 	url: `https://berkeley.minaexplorer.com/transaction/${hash}`,
	// });

	return { txUrl };
};

declare global {
	interface Window {
		reset: typeof reset;
	}
}

window.reset = reset;

export { reset };

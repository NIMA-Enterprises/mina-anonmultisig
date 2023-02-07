import { GenerateTransactionProofType } from "./worker";
import type MinaProvider from "@aurowallet/mina-provider";
import { wrap } from "comlink";
import { wagmiClient } from "wallet-connection";

const reset = async () => {
	const { generateTransactionProof } = wrap<GenerateTransactionProofType>(
		new Worker(new URL("./worker.ts", import.meta.url), {
			name: "generateTransactionProof_reset",
			type: "module",
		}),
	);

	const { proof } = await generateTransactionProof(window.PRIVATE_KEY);

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
};

declare global {
	interface Window {
		reset: typeof reset;
	}
}

window.reset = reset;

export { reset };

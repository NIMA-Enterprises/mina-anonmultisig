import { GenerateTransactionProofType } from "./worker";
import type MinaProvider from "@aurowallet/mina-provider";
import { wrap } from "comlink";
import { wagmiClient } from "wallet-connection";

const reset = async ({ contractAddress }: { contractAddress: string }) => {
	const worker = new Worker(new URL("./worker.ts", import.meta.url), {
		name: "generateTransactionProof_reset",
		type: "module",
	});
	const { generateTransactionProof } =
		wrap<GenerateTransactionProofType>(worker);

	const provider =
		(await wagmiClient.connector?.getProvider()) as MinaProvider;

	const senderAddress = (await wagmiClient.connector?.getAccount()) as string;

	console.log({ senderAddress, provider });

	const { proof } = await generateTransactionProof({
		contractAddress,
		senderAddress,
	});

	console.log({ proof });

	const { hash } = await provider.sendTransaction({
		transaction: proof,
	});

	const txUrl = `https://berkeley.minaexplorer.com/transaction/${hash}`;

	console.log("Wallet transaction finished");
	console.log({
		hash,
		url: txUrl,
	});

	worker.terminate();

	return { txUrl };
};

declare global {
	interface Window {
		reset: typeof reset;
	}
}

window.reset = reset;

export { reset };

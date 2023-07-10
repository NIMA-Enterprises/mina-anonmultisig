import { spawn } from "../spawn";
import { GenerateTransactionProofType } from "./worker";
import importedWorker from "./worker?worker";
import type MinaProvider from "@aurowallet/mina-provider";
import { wagmiClient } from "wallet-connection";

const reset = async ({ contractAddress }: { contractAddress: string }) => {
	const { worker, terminate } = await spawn<GenerateTransactionProofType>(
		importedWorker,
	);

	try {
		const provider =
			(await wagmiClient.connector?.getProvider()) as MinaProvider;

		const senderAddress =
			(await wagmiClient.connector?.getAccount()) as string;

		const { proof } = await worker.generateTransactionProof({
			contractAddress,
			senderAddress,
		});

		const { hash } = await provider.sendTransaction({
			transaction: proof,
		});

		const txUrl = `https://berkeley.minaexplorer.com/transaction/${hash}`;

		return { txUrl };
	} finally {
		terminate();
	}
};

export { reset };

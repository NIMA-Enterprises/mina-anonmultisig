import { generateCancelMessageHash } from "../generateCancelMessageHash";
import { spawn } from "../spawn";
import { GenerateTransactionProofType } from "./worker";
import type MinaProvider from "@aurowallet/mina-provider";
import { signFields } from "sign-service/src";
import { wagmiClient, waitForAccountChange } from "wallet-connection";

const cancel = async ({ contractAddress }: { contractAddress: string }) => {
	const { worker, terminate } = await spawn<GenerateTransactionProofType>(
		"./cancel/worker.ts",
	);

	try {
		const provider =
			(await wagmiClient.connector?.getProvider()) as MinaProvider;

		const memberAddress =
			(await wagmiClient.connector?.getAccount()) as any as string;

		const message = await generateCancelMessageHash({
			contractAddress,
		});

		const signatureAsBase58 = (await signFields({ message })).toBase58();

		console.log("Please change your wallet");
		console.log({ memberAddress });

		await waitForAccountChange();
		console.log("account changed");

		const feePayerAddress =
			(await wagmiClient.connector?.getAccount()) as any as string;
		console.log({ feePayerAddress });

		const { proof } = await worker.generateTransactionProof({
			contractAddress,
			memberAddress,
			feePayerAddress,
			signatureAsBase58,
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

export { cancel };

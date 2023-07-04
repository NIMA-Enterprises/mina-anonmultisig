import { generateMessageHash } from "../generateMessageHash";
import { spawn } from "../spawn";
import { GenerateTransactionProofType } from "./worker";
import type MinaProvider from "@aurowallet/mina-provider";
import { signFields } from "sign-service/src";
import { wagmiClient, waitForAccountChange } from "wallet-connection";

const makeProposal = async ({
	contractAddress,
	receiverAddress,
	amount,
}: {
	contractAddress: string;
	receiverAddress: string;
	amount: number;
}) => {
	const { worker, terminate } = await spawn<GenerateTransactionProofType>(
		"./makeProposal/worker.ts",
	);

	try {
		const provider =
			(await wagmiClient.connector?.getProvider()) as MinaProvider;

		const memberAddress =
			(await wagmiClient.connector?.getAccount()) as any as string;

		const message = await generateMessageHash({
			contractAddress,
			receiverAddress,
			amount,
		});

		const signatureAsBase58 = (await signFields({ message })).toBase58();

		// console.log("Please change your wallet");
		// await waitForAccountChange();
		// console.log("account changed");

		const { proof } = await worker.generateTransactionProof({
			contractAddress,
			receiverAddress,
			amount,
			memberAddress,
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

export { makeProposal };

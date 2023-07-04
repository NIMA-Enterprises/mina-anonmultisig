import { generateExecuteMessageHash } from "../generateExecuteMessageHash";
import { spawn } from "../spawn";
import { GenerateTransactionProofType } from "./worker";
import type MinaProvider from "@aurowallet/mina-provider";
import { signFields } from "sign-service/src";
import { wagmiClient } from "wallet-connection";

const execute = async ({
	contractAddress,
	receiverAddress,
	amount,
}: {
	contractAddress: string;
	receiverAddress: string;
	amount: number;
}) => {
	const { worker, terminate } = await spawn<GenerateTransactionProofType>(
		"./execute/worker.ts",
	);

	try {
		const provider =
			(await wagmiClient.connector?.getProvider()) as MinaProvider;

		const memberAddress =
			(await wagmiClient.connector?.getAccount()) as any as string;

		const message = await generateExecuteMessageHash({
			contractAddress,
		});

		const signatureAsBase58 = (await signFields({ message })).toBase58();

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

export { execute };

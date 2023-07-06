import { generateVoteMessageHash } from "../generateVoteMessageHash";
import { spawn } from "../spawn";
import { VoteType } from "./worker";
import type MinaProvider from "@aurowallet/mina-provider";
import { signFields } from "sign-service";
import { Field } from "snarkyjs";
import { wagmiClient, waitForAccountChange } from "wallet-connection";

const vote = async ({
	contractAddress,
	isUpVote,
}: {
	contractAddress: string;
	isUpVote: boolean;
}) => {
	const { worker, terminate } = await spawn<VoteType>("./vote/worker.ts");

	try {
		const provider =
			(await wagmiClient.connector?.getProvider()) as MinaProvider;

		const memberAddress =
			(await wagmiClient.connector?.getAccount()) as any as string;

		const message = await generateVoteMessageHash({
			contractAddress,
			isUpVote,
		});

		const signatureAsBase58 = (await signFields({ message })).toBase58();

		console.log("Please change your wallet");
		console.log({ memberAddress });

		await waitForAccountChange();
		console.log("account changed");

		const feePayerAddress =
			(await wagmiClient.connector?.getAccount()) as any as string;
		console.log({ feePayerAddress });

		const { proof } = await worker.vote({
			contractAddress,
			isUpVote,
			memberAddress,
			feePayerAddress,
			signatureAsBase58,
		});

		console.log({ proof });

		const { hash } = await provider.sendTransaction({
			transaction: proof,
		});

		const txUrl = `https://berkeley.minaexplorer.com/transaction/${hash}`;

		return { txUrl };
	} finally {
		terminate();
	}
};

export { vote };

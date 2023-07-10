import { spawn } from "../spawn";
import { generateVoteMessageHash } from "./steps/1/generateVoteMessageHash";
import { signMessage } from "./steps/2/signMessage";
import { generateTxProof } from "./steps/3/generateTxProof";
import { sendTx } from "./steps/4/sendTx";
import { waitForAccountChange } from "wallet-connection";

const vote = async ({
	contractAddress,
	isUpVote,
}: {
	contractAddress: string;
	isUpVote: boolean;
}) => {
	const { messageHash } = await generateVoteMessageHash({
		contractAddress,
		isUpVote,
	});

	const { signatureAsBase58 } = await signMessage({ messageHash });

	const { memberAddress, feePayerAddress } = await waitForAccountChange();

	const { proof } = await generateTxProof({
		contractAddress,
		isUpVote,
		memberAddress,
		feePayerAddress,
		signatureAsBase58,
	});

	const { hash } = await sendTx({
		proof,
	});

	const txUrl = `https://berkeley.minaexplorer.com/transaction/${hash}`;

	return { txUrl };
};

export { vote };

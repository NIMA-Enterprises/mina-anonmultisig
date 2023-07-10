import { generateMessageHash } from "./steps/1/generateMessageHash";
import { signMessage } from "./steps/2/signMessage";
import { generateTxProof } from "./steps/3/generateTxProof";
import { sendTx } from "./steps/4/sendTx";
import { waitForAccountChange } from "wallet-connection";

const makeProposal = async ({
	contractAddress,
	receiverAddress,
	amount,
}: {
	contractAddress: string;
	receiverAddress: string;
	amount: number;
}) => {
	const { messageHash } = await generateMessageHash({
		contractAddress,
		receiverAddress,
		amount,
	});

	const { signatureAsBase58 } = await signMessage({ messageHash });

	const { memberAddress, feePayerAddress } = await waitForAccountChange();

	const { proof } = await generateTxProof({
		contractAddress,
		receiverAddress,
		amount,
		memberAddress,
		feePayerAddress,
		signatureAsBase58,
	});

	const { hash } = await sendTx({
		proof,
	});

	return { txUrl: `https://berkeley.minaexplorer.com/transaction/${hash}` };
};

export { makeProposal };

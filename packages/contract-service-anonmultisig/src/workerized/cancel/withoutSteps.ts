import { generateCancelMessageHash } from "./steps/1/generateCancelMessageHash";
import { signMessage } from "./steps/2/signMessage";
import { generateTxProof } from "./steps/3/generateTxProof";
import { sendTx } from "./steps/4/sendTx";
import { waitForAccountChange } from "wallet-connection";

const cancel = async ({ contractAddress }: { contractAddress: string }) => {
	const { messageHash } = await generateCancelMessageHash({
		contractAddress,
	});

	const { signatureAsBase58 } = await signMessage({ messageHash });

	const { feePayerAddress, memberAddress } = await waitForAccountChange();

	const { proof } = await generateTxProof({
		contractAddress,
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

export { cancel };

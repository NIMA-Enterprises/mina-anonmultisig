import { generateMessageHash } from "../1/generateMessageHash";
import { signMessage } from "../2/signMessage";
import { spawn } from "../../../spawn";
import { GenerateTransactionProofType } from "./worker";
import importedWorker from "./worker?worker";
import { waitForAccountChange } from "wallet-connection";

const generateTxProof = async ({
	memberAddress,
	feePayerAddress,
	contractAddress,
	receiverAddress,
	amount,
	signatureAsBase58,
}: Awaited<ReturnType<typeof waitForAccountChange>> &
	Parameters<typeof generateMessageHash>[0] &
	Awaited<ReturnType<typeof signMessage>>) => {
	const { worker, terminate } = await spawn<GenerateTransactionProofType>(
		importedWorker,
	);

	try {
		const { proof } = await worker.generateTransactionProof({
			contractAddress,
			receiverAddress,
			amount,
			memberAddress,
			feePayerAddress,
			signatureAsBase58,
		});

		return { proof };
	} finally {
		terminate();
	}
};

export { generateTxProof };

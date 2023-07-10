import { generateExecuteMessageHash } from "../1/generateExecuteMessageHash";
import { signMessage } from "../2/signMessage";
import { spawn } from "../../../spawn";
import { GenerateTransactionProofType } from "./worker";
import importedWorker from "./worker?worker";
import { waitForAccountChange } from "wallet-connection";

const generateTxProof = async ({
	memberAddress,
	feePayerAddress,
	signatureAsBase58,
	contractAddress,
	amount,
	receiverAddress,
}: Awaited<ReturnType<typeof waitForAccountChange>> &
	Awaited<ReturnType<typeof signMessage>> & {
		contractAddress: string;
		receiverAddress: string;
		amount: number;
	}) => {
	const { worker, terminate } = await spawn<GenerateTransactionProofType>(
		importedWorker,
	);

	try {
		const { proof } = await worker.generateTransactionProof({
			contractAddress,
			memberAddress,
			feePayerAddress,
			signatureAsBase58,
			amount,
			receiverAddress,
		});

		return { proof };
	} finally {
		terminate();
	}
};

export { generateTxProof };

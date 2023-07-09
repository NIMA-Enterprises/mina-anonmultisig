import { signMessage } from "../2/signMessage";
import { spawn } from "../../../spawn";
import { makeProposal } from "../../withoutSteps";
import { GenerateTransactionProofType } from "./worker";
import { waitForAccountChange } from "wallet-connection";

const generateTxProof = async ({
	memberAddress,
	feePayerAddress,
	contractAddress,
	receiverAddress,
	amount,
	signatureAsBase58,
}: Awaited<ReturnType<typeof waitForAccountChange>> &
	Parameters<typeof makeProposal>[0] &
	Awaited<ReturnType<typeof signMessage>>) => {
	const { worker, terminate } = await spawn<GenerateTransactionProofType>(
		"./makeProposal/steps/3/worker.ts",
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

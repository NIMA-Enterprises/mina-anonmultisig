import { generateVoteMessageHash } from "../1/generateVoteMessageHash";
import { signMessage } from "../2/signMessage";
import { spawn } from "../../../spawn";
import { GenerateTransactionProofType } from "./worker";
import importedWorker from "./worker?worker";
import { waitForAccountChange } from "wallet-connection";

const generateTxProof = async ({
	memberAddress,
	feePayerAddress,
	contractAddress,
	signatureAsBase58,
	isUpVote,
}: Awaited<ReturnType<typeof waitForAccountChange>> &
	Parameters<typeof generateVoteMessageHash>[0] &
	Awaited<ReturnType<typeof signMessage>>) => {
	const { worker, terminate } = await spawn<GenerateTransactionProofType>(
		importedWorker,
	);

	try {
		const { proof } = await worker.generateTransactionProof({
			contractAddress,
			memberAddress,
			feePayerAddress,
			signatureAsBase58,
			isUpVote,
		});

		return { proof };
	} finally {
		terminate();
	}
};

export { generateTxProof };

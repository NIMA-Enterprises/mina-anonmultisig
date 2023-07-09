import { spawn } from "../../../../spawn";
import { GenerateMessageHashType } from "./worker";

const generateMessageHash = async ({
	contractAddress,
	receiverAddress,
	amount,
}: {
	contractAddress: string;
	receiverAddress: string;
	amount: number;
}) => {
	const { worker, terminate } = await spawn<GenerateMessageHashType>(
		"./makeProposal/steps/1/generateMessageHash/worker.ts",
	);

	try {
		const { messageHash } = await worker.generateProposalMessageHash({
			contractAddress,
			receiverAddress,
			amount,
		});

		return { messageHash };
	} finally {
		terminate();
	}
};

export { generateMessageHash };

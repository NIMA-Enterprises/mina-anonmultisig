import { spawn } from "../../../../spawn";
import { GenerateMessageHashType } from "./worker";
import importedWorker from "./worker?worker";

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
		importedWorker,
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

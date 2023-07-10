import { spawn } from "../../../../spawn";
import { GenerateMessageHashType } from "./worker";
import importedWorker from "./worker?worker";

const generateVoteMessageHash = async ({
	contractAddress,
	isUpVote,
}: {
	contractAddress: string;
	isUpVote: boolean;
}) => {
	const { worker, terminate } = await spawn<GenerateMessageHashType>(
		importedWorker,
	);

	try {
		const { messageHash } = await worker.generateVoteMessageHash({
			contractAddress,
			isUpVote,
		});

		return { messageHash };
	} finally {
		terminate();
	}
};

export { generateVoteMessageHash };

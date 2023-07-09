import { spawn } from "../../../../spawn";
import { GenerateMessageHashType } from "./worker";

const generateVoteMessageHash = async ({
	contractAddress,
	isUpVote,
}: {
	contractAddress: string;
	isUpVote: boolean;
}) => {
	const { worker, terminate } = await spawn<GenerateMessageHashType>(
		"./vote/steps/1/generateVoteMessageHash/worker.ts",
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

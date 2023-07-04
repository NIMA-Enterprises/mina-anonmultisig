import { spawn } from "../spawn";
import { GenerateMessageHashType } from "./worker";
import { Field } from "snarkyjs";

const generateVoteMessageHash = async ({
	contractAddress,
	isUpVote,
}: {
	contractAddress: string;
	isUpVote: boolean;
}) => {
	const { worker, terminate } = await spawn<GenerateMessageHashType>(
		"./generateVoteMessageHash/worker.ts",
	);

	try {
		const { messageHash } = await worker.generateVoteMessageHash({
			contractAddress,
			isUpVote,
		});

		return Field.fromJSON(messageHash);
	} finally {
		terminate();
	}
};

export { generateVoteMessageHash };

import { spawn } from "../../../../spawn";
import { GenerateMessageHashType } from "./worker";

const generateCancelMessageHash = async ({
	contractAddress,
}: {
	contractAddress: string;
}) => {
	const { worker, terminate } = await spawn<GenerateMessageHashType>(
		"./cancel/steps/1/generateCancelMessageHash/worker.ts",
	);

	try {
		const { messageHash } = await worker.generateCancelMessageHash({
			contractAddress,
		});

		return { messageHash };
	} finally {
		terminate();
	}
};

export { generateCancelMessageHash };

import { spawn } from "../../../../spawn";
import { GenerateMessageHashType } from "./worker";

const generateExecuteMessageHash = async ({
	contractAddress,
}: {
	contractAddress: string;
}) => {
	const { worker, terminate } = await spawn<GenerateMessageHashType>(
		"./execute/steps/1/generateExecuteMessageHash/worker.ts",
	);

	try {
		const { messageHash } = await worker.generateExecuteMessageHash({
			contractAddress,
		});

		return { messageHash };
	} finally {
		terminate();
	}
};

export { generateExecuteMessageHash };

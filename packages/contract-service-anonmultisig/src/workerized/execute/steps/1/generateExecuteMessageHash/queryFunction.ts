import { spawn } from "../../../../spawn";
import { GenerateMessageHashType } from "./worker";
import importedWorker from "./worker?worker";

const generateExecuteMessageHash = async ({
	contractAddress,
}: {
	contractAddress: string;
}) => {
	const { worker, terminate } = await spawn<GenerateMessageHashType>(
		importedWorker,
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

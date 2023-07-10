import { spawn } from "../../../../spawn";
import { GenerateMessageHashType } from "./worker";
import importedWorker from "./worker?worker";

const generateCancelMessageHash = async ({
	contractAddress,
}: {
	contractAddress: string;
}) => {
	const { worker, terminate } = await spawn<GenerateMessageHashType>(
		importedWorker,
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

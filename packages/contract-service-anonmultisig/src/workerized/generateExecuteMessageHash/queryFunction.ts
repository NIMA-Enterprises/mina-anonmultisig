import { spawn } from "../spawn";
import { GenerateMessageHashType } from "./worker";
import { Field } from "snarkyjs";

const generateExecuteMessageHash = async ({
	contractAddress,
}: {
	contractAddress: string;
}) => {
	const { worker, terminate } = await spawn<GenerateMessageHashType>(
		"./generateExecuteMessageHash/worker.ts",
	);

	try {
		const { messageHash } = await worker.generateExecuteMessageHash({
			contractAddress,
		});

		return Field.fromJSON(messageHash);
	} finally {
		terminate();
	}
};

export { generateExecuteMessageHash };

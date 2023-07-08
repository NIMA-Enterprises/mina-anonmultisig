import { spawn } from "../spawn";
import { GenerateMessageHashType } from "./worker";
import { Field } from "snarkyjs";

const generateCancelMessageHash = async ({
	contractAddress,
}: {
	contractAddress: string;
}) => {
	const { worker, terminate } = await spawn<GenerateMessageHashType>(
		"./generateCancelMessageHash/worker.ts",
	);

	try {
		const { messageHash } = await worker.generateCancelMessageHash({
			contractAddress,
		});

		return Field.fromJSON(messageHash);
	} finally {
		terminate();
	}
};

export { generateCancelMessageHash };

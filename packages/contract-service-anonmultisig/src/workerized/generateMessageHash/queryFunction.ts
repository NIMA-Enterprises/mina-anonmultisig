import { spawn } from "../spawn";
import { GenerateMessageHashType } from "./worker";
import { Field } from "snarkyjs";

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
		"./generateMessageHash/worker.ts",
	);

	const { messageHash } = await worker.generateProposalMessageHash({
		contractAddress,
		receiverAddress,
		amount,
	});

	terminate();

	return Field.fromJSON(messageHash);
};

export { generateMessageHash };

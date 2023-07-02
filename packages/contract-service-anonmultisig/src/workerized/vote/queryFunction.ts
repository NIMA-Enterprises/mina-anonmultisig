import { spawn } from "../spawn";
import { VoteType } from "./worker";
import { Field } from "snarkyjs";

const vote = async ({
	contractAddress,
	receiverAddress,
	amount,
}: {
	contractAddress: string;
	receiverAddress: string;
	amount: number;
}) => {
	const { worker, terminate } = await spawn<VoteType>("./vote/worker.ts");

	const { messageHash } = await worker.vote({});

	terminate();

	return Field.fromJSON(messageHash);
};

export { generateMessageHash };

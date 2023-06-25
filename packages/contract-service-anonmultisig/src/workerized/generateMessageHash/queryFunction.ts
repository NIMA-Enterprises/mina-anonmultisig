import { generateMessageHash as gmh } from "../../pure/generateMessageHash";
import { GenerateMessageHashType } from "./worker";
import { wrap } from "comlink";
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
	// const worker = new Worker(new URL("./worker.ts", import.meta.url), {
	// 	name: "generateMessageHash",
	// 	type: "module",
	// });

	// const { generateMessageHash } = wrap<GenerateMessageHashType>(worker);

	const { messageHash } = await gmh({
		contractAddress,
		receiverAddress,
		amount,
	});

	// worker.terminate();

	return Field.fromJSON(messageHash);
};

export { generateMessageHash };

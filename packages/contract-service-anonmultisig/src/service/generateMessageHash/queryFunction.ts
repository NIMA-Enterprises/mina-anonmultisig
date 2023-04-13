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
	const worker = new Worker(new URL("./worker.ts", import.meta.url), {
		name: "generateMessageHash",
		type: "module",
	});

	const { generateMessageHash } = wrap<GenerateMessageHashType>(worker);

	const { messageHash } = await generateMessageHash({
		contractAddress,
		receiverAddress,
		amount,
	});

	worker.terminate();

	return Field.fromJSON(messageHash);
};

declare global {
	interface Window {
		generateMessageHash: typeof generateMessageHash;
	}
}

window.generateMessageHash = generateMessageHash;

export { generateMessageHash };

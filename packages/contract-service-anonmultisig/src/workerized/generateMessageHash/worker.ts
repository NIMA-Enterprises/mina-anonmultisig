import { generateMessageHash } from "../../pure/generateMessageHash";
import { expose } from "comlink";

const worker = {
	generateMessageHash,
};

export type GenerateMessageHashType = typeof worker;

expose(worker);

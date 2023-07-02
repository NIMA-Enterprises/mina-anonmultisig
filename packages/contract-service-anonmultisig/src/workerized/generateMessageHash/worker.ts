import { generateMessageHash } from "../../pure/generateMessageHash";
import { Ready } from "../spawn";
import { expose } from "comlink";

const worker = {
	generateMessageHash,
};

export type GenerateMessageHashType = typeof worker;

expose(worker);
postMessage(Ready);

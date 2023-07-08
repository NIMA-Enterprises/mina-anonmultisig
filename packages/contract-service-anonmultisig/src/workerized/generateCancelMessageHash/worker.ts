import { generateCancelMessageHash } from "../../pure/generateCancelMessageHash";
import { Ready } from "../spawn";
import { expose } from "comlink";

const worker = {
	generateCancelMessageHash,
};

export type GenerateMessageHashType = typeof worker;

expose(worker);
postMessage(Ready);

import { generateExecuteMessageHash } from "../../../../../pure/generateExecuteMessageHash";
import { Ready } from "../../../../spawn";
import { expose } from "comlink";

const worker = {
	generateExecuteMessageHash,
};

export type GenerateMessageHashType = typeof worker;

expose(worker);
postMessage(Ready);

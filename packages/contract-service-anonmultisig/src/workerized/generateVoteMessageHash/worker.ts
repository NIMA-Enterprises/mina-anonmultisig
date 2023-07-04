import { generateVoteMessageHash } from "../../pure/generateVoteMessageHash";
import { Ready } from "../spawn";
import { expose } from "comlink";

const worker = {
	generateVoteMessageHash,
};

export type GenerateMessageHashType = typeof worker;

expose(worker);
postMessage(Ready);

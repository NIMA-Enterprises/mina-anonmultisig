import { generateProposalMessageHash } from "../../../../../pure/generateProposalMessageHash";
import { Ready } from "../../../../spawn";
import { expose } from "comlink";

const worker = {
	generateProposalMessageHash,
};

export type GenerateMessageHashType = typeof worker;

expose(worker);
postMessage(Ready);

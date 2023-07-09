import { vote } from "../../../../pure/vote";
import { Ready } from "../../../spawn";
import { expose } from "comlink";

const worker = {
	generateTransactionProof: vote,
};

export type GenerateTransactionProofType = typeof worker;

expose(worker);
postMessage(Ready);

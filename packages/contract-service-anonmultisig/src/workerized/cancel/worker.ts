import { cancel } from "../../pure/cancel";
import { Ready } from "../spawn";
import { expose } from "comlink";

const worker = {
	generateTransactionProof: cancel,
};

export type GenerateTransactionProofType = typeof worker;

expose(worker);
postMessage(Ready);

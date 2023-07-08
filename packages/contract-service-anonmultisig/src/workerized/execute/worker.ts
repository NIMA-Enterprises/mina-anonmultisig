import { execute } from "../../pure/execute";
import { Ready } from "../spawn";
import { expose } from "comlink";

const worker = {
	generateTransactionProof: execute,
};

export type GenerateTransactionProofType = typeof worker;

expose(worker);
postMessage(Ready);

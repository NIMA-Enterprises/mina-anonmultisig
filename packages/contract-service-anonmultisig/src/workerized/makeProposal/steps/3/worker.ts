import { makeProposal } from "../../../../pure/makeProposal";
import { Ready } from "../../../spawn";
import { expose } from "comlink";

const worker = {
	generateTransactionProof: makeProposal,
};

export type GenerateTransactionProofType = typeof worker;

expose(worker);
postMessage(Ready);

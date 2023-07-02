import { vote } from "../../pure/vote";
import { Ready } from "../spawn";
import { expose } from "comlink";

const worker = {
	vote,
};

export type VoteType = typeof worker;

expose(worker);
postMessage(Ready);

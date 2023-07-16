import { countVotes } from "../../pure";
import { Ready } from "../spawn";
import { expose } from "comlink";

const worker = {
	countVotes,
};

export type CountVotesType = typeof worker;

expose(worker);
postMessage(Ready);

import { readStateFields } from "../../pure";
import { Ready } from "../spawn";
import { expose } from "comlink";

const worker = {
	readStateFields,
};

export type ReadStateFieldsType = typeof worker;

expose(worker);
postMessage(Ready);

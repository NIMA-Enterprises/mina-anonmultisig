import { readStateFields } from "../../pure";
import { expose } from "comlink";

const worker = {
	readStateFields,
};

export type ReadStateFieldsType = typeof worker;

expose(worker);

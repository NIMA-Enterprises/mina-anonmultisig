import { readStateFields as rsf } from "../../pure";
import { spawn } from "../spawn";
import { ReadStateFieldsType } from "./worker";
import { wrap } from "comlink";
import { Field } from "snarkyjs";

const readStateFields = async (
	...args: Parameters<ReadStateFieldsType["readStateFields"]>
) => {
	const { worker, terminate } = await spawn<ReadStateFieldsType>(
		"./readStateFields/worker.ts",
	);

	const workerResult = await worker.readStateFields(...args);

	const membersTreeRoot = Field.fromJSON(workerResult.membersTreeRoot);
	const minimalQuorum = Field.fromJSON(workerResult.minimalQuorum);
	const proposalHash = Field.fromJSON(workerResult.proposalHash);
	const proposalId = Field.fromJSON(workerResult.proposalId);
	const voteActionState = Field.fromJSON(workerResult.voteActionState);

	terminate();

	return {
		membersTreeRoot,
		minimalQuorum,
		proposalId,
		proposalHash,
		voteActionState,
	};
};

export { readStateFields };

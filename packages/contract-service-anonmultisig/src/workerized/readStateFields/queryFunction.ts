import { readStateFields as rsf } from "../../pure";
import { ReadStateFieldsType } from "./worker";
import { wrap } from "comlink";
import { Field } from "snarkyjs";

const readStateFields = async (
	...args: Parameters<ReadStateFieldsType["readStateFields"]>
) => {
	// const { readStateFields } = wrap<ReadStateFieldsType>(
	// 	new Worker(new URL("./worker.ts", import.meta.url), {
	// 		name: "readStateFields",
	// 		type: "module",
	// 	}),
	// );

	const workerResult = await rsf(...args);

	const membersTreeRoot = Field.fromJSON(workerResult.membersTreeRoot);
	const minimalQuorum = Field.fromJSON(workerResult.minimalQuorum);
	const proposalHash = Field.fromJSON(workerResult.proposalHash);
	const proposalId = Field.fromJSON(workerResult.proposalId);
	const voteActionState = Field.fromJSON(workerResult.voteActionState);

	return {
		membersTreeRoot,
		minimalQuorum,
		proposalId,
		proposalHash,
		voteActionState,
	};
};

export { readStateFields };
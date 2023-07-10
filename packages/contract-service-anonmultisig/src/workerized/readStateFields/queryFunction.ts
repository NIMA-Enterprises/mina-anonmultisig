import { spawn } from "../spawn";
import { ReadStateFieldsType } from "./worker";
import importedWorker from "./worker?worker";

// import { Field } from "snarkyjs";

const readStateFields = async (
	...args: Parameters<ReadStateFieldsType["readStateFields"]>
) => {
	const { worker, terminate } = await spawn<ReadStateFieldsType>(
		importedWorker,
	);

	try {
		const workerResult = await worker.readStateFields(...args);

		return workerResult;

		// const membersTreeRoot = Field.fromJSON(workerResult.membersTreeRoot);
		// const minimalQuorum = Field.fromJSON(workerResult.minimalQuorum);
		// const proposalHash = Field.fromJSON(workerResult.proposalHash);
		// const proposalId = Field.fromJSON(workerResult.proposalId);
		// const voteActionState = Field.fromJSON(workerResult.voteActionState);

		// return {
		// 	membersTreeRoot,
		// 	minimalQuorum,
		// 	proposalId,
		// 	proposalHash,
		// 	voteActionState,
		// };
	} finally {
		terminate();
	}
};

export { readStateFields };

import { ReadStateFieldsType } from "./worker";
import { wrap } from "comlink";
import { Field } from "snarkyjs";

const readStateFields = async (
	...args: Parameters<ReadStateFieldsType["readStateFields"]>
) => {
	const { readStateFields } = wrap<ReadStateFieldsType>(
		new Worker(new URL("./worker.ts", import.meta.url), {
			name: "readStateFields",
			type: "module",
		}),
	);

	const workerResult = await readStateFields(...args);

	const membersTreeRoot = Field.fromJSON(workerResult.membersTreeRoot);
	const minimalQuorum = Field.fromJSON(workerResult.minimalQuorum);
	const proposalHash = Field.fromJSON(workerResult.proposalHash);
	const proposalId = Field.fromJSON(workerResult.proposalId);
	const voteActionsHash = Field.fromJSON(workerResult.voteActionsHash);

	return {
		membersTreeRoot,
		minimalQuorum,
		proposalId,
		proposalHash,
		voteActionsHash,
	};
};

declare global {
	interface Window {
		readStateFields: typeof readStateFields;
	}
}

window.readStateFields = readStateFields;

export { readStateFields };

import { createAnonMultiSigContract } from "../../createAnonMultiSigContract";
import { ReadContractType } from "./worker";
import { wrap } from "comlink";
import { Field } from "snarkyjs";

const readStateFields = async (
	...args: Parameters<ReadContractType["readContract"]>
) => {
	const { readContract } = wrap<ReadContractType>(
		new Worker(new URL("./worker.ts", import.meta.url), {
			name: "readStateFields",
			type: "module",
		}),
	);

	const workerResult = await readContract(...args);

	const admin = Field.fromJSON(workerResult.admin);
	const membersTreeRoot = Field.fromJSON(workerResult.membersTreeRoot);
	const minimalQuorum = Field.fromJSON(workerResult.minimalQuorum);
	const numberOfMembers = Field.fromJSON(workerResult.numberOfMembers);
	const proposalHash = Field.fromJSON(workerResult.proposalHash);
	const proposalId = Field.fromJSON(workerResult.proposalId);
	const proposalVotes = Field.fromJSON(workerResult.proposalVotes);

	return {
		admin,
		membersTreeRoot,
		numberOfMembers,
		minimalQuorum,
		proposalId,
		proposalHash,
		proposalVotes,
	};
};

declare global {
	interface Window {
		readStateFields: typeof readStateFields;
	}
}

window.readStateFields = readStateFields;

export { readStateFields };

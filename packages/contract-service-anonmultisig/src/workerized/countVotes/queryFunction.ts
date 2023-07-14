import { spawn } from "../spawn";
import { CountVotesType } from "./worker";
import importedWorker from "./worker?worker";

// import { Field } from "snarkyjs";

const countVotes = async (
	...args: Parameters<CountVotesType["countVotes"]>
) => {
	const { worker, terminate } = await spawn<CountVotesType>(importedWorker);

	try {
		const workerResult = await worker.countVotes(...args);

		return workerResult;
	} finally {
		terminate();
	}
};

export { countVotes };

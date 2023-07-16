import { createAnonMultiSigContract } from "../createAnonMultiSigContract";
import { Field } from "snarkyjs";
import wait from "wait";

const countVotes = async ({ contractAddress }: { contractAddress: string }) => {
	await wait(1000);
	// const { zkAppInstance } = await createAnonMultiSigContract({
	// 	contractAddress,
	// 	skipCompile: true,
	// });

	// const notVotedYetCount = +zkAppInstance.countVotes(Field(0))[0].toJSON();
	// const upVotesCount = +zkAppInstance.countVotes(Field(1))[0].toJSON();
	// const downVotesCount = +zkAppInstance.countVotes(Field(2))[0].toJSON();

	const notVotedYetCount = 0;
	const upVotesCount = 3;
	const downVotesCount = 1;
	const votedCount = upVotesCount + upVotesCount;
	const numberOfMembers = notVotedYetCount + votedCount;

	return {
		notVotedYetCount,
		upVotesCount,
		downVotesCount,
		votedCount,
		numberOfMembers,
	};
};

export { countVotes };

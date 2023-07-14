import { createAnonMultiSigContract } from "../createAnonMultiSigContract";
import { Field } from "snarkyjs";

const countVotes = async ({ contractAddress }: { contractAddress: string }) => {
	const { zkAppInstance } = await createAnonMultiSigContract({
		contractAddress,
		skipCompile: true,
	});

	const notVotedYetCount = zkAppInstance.countVotes(Field(0))[0].toJSON();
	const upVotesCount = zkAppInstance.countVotes(Field(1))[0].toJSON();
	const downVotesCount = zkAppInstance.countVotes(Field(2))[0].toJSON();

	return {
		notVotedYetCount,
		upVotesCount,
		downVotesCount,
	};
};

export { countVotes };

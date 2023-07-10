import { MyMerkleWitness } from "../MyMerkleWitness";
import { createAnonMultiSigContract } from "../createAnonMultiSigContract";
import {
	getVoteWitnessBackend,
	getWitnessBackend,
} from "backend-service-anonmultisig";
import { Field, MerkleMapWitness, Mina, PublicKey, Signature } from "snarkyjs";

const vote = async ({
	contractAddress,
	memberAddress,
	feePayerAddress,
	isUpVote,
	signatureAsBase58,
}: {
	contractAddress: string;
	isUpVote: boolean;
	memberAddress: string;
	feePayerAddress: string;
	signatureAsBase58: string;
}) => {
	const { zkAppInstance } = await createAnonMultiSigContract({
		contractAddress,
	});

	const member = PublicKey.fromBase58(memberAddress);
	const feePayer = PublicKey.fromBase58(feePayerAddress);

	const path = await getWitnessBackend({ memberAddress });
	const pathAsMyMerkleWitness = MyMerkleWitness.fromJSON(path);

	const signature = Signature.fromBase58(signatureAsBase58);

	const getVoteWitnessBackendResult = await getVoteWitnessBackend({
		memberAddress,
	});

	const value = Field.fromJSON(getVoteWitnessBackendResult.value);
	const mapPath = MerkleMapWitness.fromJSON(getVoteWitnessBackendResult.path);

	const voteField = Field(isUpVote ? 1 : 2);

	const txn = await Mina.transaction(
		{
			sender: feePayer,
			fee: 100_000_000,
			memo: "Frontend App Vote",
		},
		() => {
			zkAppInstance.vote(
				member,
				pathAsMyMerkleWitness,
				signature,
				mapPath,
				value,
				voteField,
			);
		},
	);

	await txn.prove();

	return {
		proof: txn.toJSON(),
	};
};

export { vote };

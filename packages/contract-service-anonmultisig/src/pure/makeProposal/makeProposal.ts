import { MyMerkleWitness } from "../MyMerkleWitness";
import { createAnonMultiSigContract } from "../createAnonMultiSigContract";
import { generateProposalHash } from "../generateProposalHash";
import { getWitnessBackend } from "backend-service-anonmultisig";
import { Mina, PublicKey, Signature } from "snarkyjs";

const makeProposal = async ({
	contractAddress,
	receiverAddress,
	amount,
	memberAddress,
	feePayerAddress,
	signatureAsBase58,
}: {
	contractAddress: string;
	receiverAddress: string;
	amount: number;
	memberAddress: string;
	feePayerAddress: string;
	signatureAsBase58: string;
}) => {
	const { proposalHash } = generateProposalHash({ receiverAddress, amount });

	const member = PublicKey.fromBase58(memberAddress);
	const feePayer = PublicKey.fromBase58(feePayerAddress);

	const path = await getWitnessBackend({ memberAddress });
	const pathAsMyMerkleWitness = MyMerkleWitness.fromJSON(path);

	const signature = Signature.fromBase58(signatureAsBase58);

	console.log(
		JSON.stringify({
			memberAddress,
			feePayerAddress,
			signature,
			path,
			proposalHash,
		}),
	);

	const { zkAppInstance } = await createAnonMultiSigContract({
		contractAddress,
	});

	const txn = await Mina.transaction(
		{
			sender: feePayer,
			fee: 100_000_000,
			memo: "Frontend App Make Proposal",
		},
		() => {
			zkAppInstance.propose(
				member,
				pathAsMyMerkleWitness,
				signature,
				proposalHash,
			);
		},
	);

	await txn.prove();

	return {
		proof: txn.toJSON(),
	};
};

export { makeProposal };

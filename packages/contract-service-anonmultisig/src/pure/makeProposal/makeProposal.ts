import { MyMerkleWitness } from "../MyMerkleWitness";
import { createAnonMultiSigContract } from "../createAnonMultiSigContract";
import { generateMessageHash } from "../generateMessageHash";
import { generateProposalHash } from "../generateProposalHash";
import { getWitnessBackend } from "backend-service-anonmultisig";
import { Mina, Poseidon, PublicKey, Signature } from "snarkyjs";

const makeProposal = async ({
	contractAddress,
	receiverAddress,
	amount,
	memberAddress,
	signatureAsBase58,
}: {
	contractAddress: string;
	receiverAddress: string;
	amount: number;
	memberAddress: string;
	signatureAsBase58: string;
}) => {
	const { zkAppInstance } = await createAnonMultiSigContract({
		contractAddress,
	});

	const { proposalHash } = generateProposalHash({ receiverAddress, amount });

	const member = PublicKey.fromBase58(memberAddress);

	const path = await getWitnessBackend({ memberAddress });
	const pathAsMyMerkleWitness = MyMerkleWitness.fromJSON(path);

	console.log({
		where: "xxxxxxxx",
		memberAddress,
		root: pathAsMyMerkleWitness
			.calculateRoot(Poseidon.hash(member.toFields()))
			.toJSON(),
	});

	const signature = Signature.fromBase58(signatureAsBase58);

	console.log({
		proposalHash,
		member,
		path,
		signature,
		sig: signature.toBase58(),
	});

	const txn = await Mina.transaction(
		{
			sender: member,
			fee: 100_000_000,
			memo: "Frontend App Make Proposal",
		},
		() => {
			zkAppInstance.makeProposal(
				member,
				pathAsMyMerkleWitness,
				signature,
				proposalHash,
			);
		},
	);

	console.log({ txn });

	await txn.prove();

	return {
		proof: txn.toJSON(),
	};
};

export { makeProposal };

import { MyMerkleWitness } from "../MyMerkleWitness";
import { createAnonMultiSigContract } from "../createAnonMultiSigContract";
import { getWitnessBackend } from "backend-service-anonmultisig";
import { Mina, PublicKey, Signature } from "snarkyjs";

const cancel = async ({
	contractAddress,
	memberAddress,
	feePayerAddress,
	signatureAsBase58,
}: {
	contractAddress: string;
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

	console.log(
		JSON.stringify({
			member: member.toJSON(),
			pathAsMyMerkleWitness: pathAsMyMerkleWitness.toJSON(),
			signature: signature.toJSON(),
		}),
	);

	const txn = await Mina.transaction(
		{
			sender: feePayer,
			fee: 100_000_000,
			memo: "Frontend App Cancel",
		},
		() => {
			zkAppInstance.cancel(member, pathAsMyMerkleWitness, signature);
		},
	);

	console.log(txn);

	await txn.prove();

	return {
		proof: txn.toJSON(),
	};
};

export { cancel };

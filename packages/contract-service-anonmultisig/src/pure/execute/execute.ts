import { MyMerkleWitness } from "../MyMerkleWitness";
import { createAnonMultiSigContract } from "../createAnonMultiSigContract";
import { getWitnessBackend } from "backend-service-anonmultisig";
import { Mina, PublicKey, Signature, UInt64 } from "snarkyjs";

const execute = async ({
	contractAddress,
	memberAddress,
	signatureAsBase58,
	receiverAddress,
	amount,
}: {
	contractAddress: string;
	memberAddress: string;
	signatureAsBase58: string;
	receiverAddress: string;
	amount: number;
}) => {
	const { zkAppInstance } = await createAnonMultiSigContract({
		contractAddress,
	});

	const member = PublicKey.fromBase58(memberAddress);

	const path = await getWitnessBackend({ memberAddress });
	const pathAsMyMerkleWitness = MyMerkleWitness.fromJSON(path);

	const signature = Signature.fromBase58(signatureAsBase58);

	const receiverAddressAsField = PublicKey.fromBase58(receiverAddress);

	const amountAsField = UInt64.from(amount);

	console.log(
		JSON.stringify({
			member: member.toJSON(),
			pathAsMyMerkleWitness: pathAsMyMerkleWitness.toJSON(),
			signature: signature.toJSON(),
		}),
	);

	const txn = await Mina.transaction(
		{
			sender: member,
			fee: 100_000_000,
			memo: "Frontend App Execute",
		},
		() => {
			zkAppInstance.execute(
				member,
				pathAsMyMerkleWitness,
				signature,
				receiverAddressAsField,
				amountAsField,
			);
		},
	);

	console.log(txn);

	await txn.prove();

	return {
		proof: txn.toJSON(),
	};
};

export { execute };

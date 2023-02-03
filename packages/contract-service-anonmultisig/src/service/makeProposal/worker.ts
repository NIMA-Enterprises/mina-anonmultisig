import { createAnonMultiSigContract } from "../../createAnonMultiSigContract";
import { expose } from "comlink";
import {
	CircuitString,
	Field,
	MerkleTree,
	MerkleWitness,
	Mina,
	Poseidon,
	PublicKey,
	Signature,
} from "snarkyjs";

class MyMerkleWitness extends MerkleWitness(8) {}

const generateTransactionProof = async ({
	admin,
	memberPkString,
	signature,
	pathAsObject,
	contractAddress,
}: {
	admin: string;
	memberPkString: string;
	signature: Pick<Signature, "r" | "s">;
	pathAsObject: { isLeft: boolean; sibling: string }[];
	contractAddress: string;
}) => {
	console.log(new Date());

	const { zkAppInstance } = await createAnonMultiSigContract({
		contractAddress,
	});

	const adminPK = PublicKey.fromBase58(admin);
	const memberHashZK = Poseidon.hash(
		PublicKey.fromBase58(memberPkString).toFields(),
	);
	const path = new MyMerkleWitness(
		pathAsObject.map(({ isLeft, sibling }) => ({
			isLeft,
			sibling: Field.fromJSON(sibling),
		})),
	);
	const proposalHash: Field = CircuitString.fromString("Test1").hash();

	console.log({
		adminPK,
		memberHashZK,
		path,
		proposalHash,
	});

	console.log("Start creating Mina.transaction");

	const txn = await Mina.transaction(() =>
		zkAppInstance.makeProposal(
			adminPK,
			memberHashZK,
			path,
			Signature.fromJSON(signature),
			proposalHash,
		),
	);

	console.log("Mina.transaction created");
	console.log({ txn });
	console.log(new Date());

	console.log(
		"Start creating transaction proof. This can take a while. Please wait.",
	);
	await txn.prove();
	console.log("Proof created");
	console.log({ txn, json: txn.toJSON() });
	console.log(new Date());

	return {
		proof: txn.toJSON(),
	};
};

const worker = {
	generateTransactionProof,
};

export type GenerateTransactionProofType = typeof worker;

expose(worker);

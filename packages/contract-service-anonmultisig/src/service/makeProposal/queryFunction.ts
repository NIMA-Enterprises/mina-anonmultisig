import * as snarkyjs from "snarkyjs";
import { createAnonMultiSigContract } from "../../createAnonMultiSigContract";
import type MinaProvider from "@aurowallet/mina-provider";
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
import { wagmiClient } from "wallet-connection";

window.snarkyjs = snarkyjs;

class MyMerkleWitness extends MerkleWitness(8) {}
window.MyMerkleWitness = MyMerkleWitness;

const makeProposal = async ({
	admin,
	memberPkString,
	signature,
	pathAsObject,
	contractAddress,
}: {
	admin: string;
	memberPkString: string;
	signature: Pick<Signature, "r" | "s">;
	pathAsObject: ReturnType<MerkleTree["getWitness"]>;
	contractAddress: string;
}) => {
	console.log({
		where: "makeProposal",
		calledWith: {
			admin,
			memberPkString,
			signature,
			pathAsObject,
		},
	});

	console.log(new Date());

	const { zkAppInstance } = await createAnonMultiSigContract({
		contractAddress,
	});

	const adminPK = PublicKey.fromBase58(admin);
	const memberHashZK = Poseidon.hash(
		PublicKey.fromBase58(memberPkString).toFields(),
	);
	const path = new MyMerkleWitness(pathAsObject);
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

	console.log("Wallet transaction started");
	const provider =
		(await wagmiClient.connector?.getProvider()) as MinaProvider;
	console.log({ provider });

	const { hash } = await provider.sendTransaction({
		transaction: txn.toJSON(),
	});

	console.log("Wallet transaction finished");
	console.log({
		hash,
		url: `https://berkeley.minaexplorer.com/transaction/${hash}`,
	});
};

// declare global {
// 	interface Window {
// 		makeProposal: typeof makeProposal;
// 	}
// }

// window.makeProposal = makeProposal;

export { makeProposal };

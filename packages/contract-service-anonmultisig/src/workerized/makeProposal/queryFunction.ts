import * as snarkyjs from "snarkyjs";
import { generateMessageHash } from "../generateMessageHash";
import { GenerateTransactionProofType } from "./worker";
import type MinaProvider from "@aurowallet/mina-provider";
import { wrap } from "comlink";
import Client from "mina-signer";
import { signFields } from "sign-service/src";
import { PrivateKey, PublicKey, Signature } from "snarkyjs";
import { wagmiClient } from "wallet-connection";

window.snarkyjs = snarkyjs;
window.Client = Client;
const makeProposal = async ({
	contractAddress,
	receiverAddress,
	amount,
}: {
	contractAddress: string;
	receiverAddress: string;
	amount: number;
}) => {
	const worker = new Worker(new URL("./worker.ts", import.meta.url), {
		name: "generateTransactionProof_makeProposal",
		type: "module",
	});
	const { generateTransactionProof } =
		wrap<GenerateTransactionProofType>(worker);

	const provider =
		(await wagmiClient.connector?.getProvider()) as MinaProvider;

	const memberAddress =
		(await wagmiClient.connector?.getAccount()) as any as string;

	const message = await generateMessageHash({
		contractAddress,
		receiverAddress,
		amount,
	});

	const signatureAsBase58 = (await signFields({ message })).toBase58();

	const contractSignatureAsBase58 = Signature.create(
		PrivateKey.fromBase58(
			"EKERy8voLbJzSAuzfpXeJ5CiGNcbo27HXU5RhT1TAn6tGS3XqQSs",
		),
		message.toFields(),
	).toBase58();

	console.log({
		memberAddress,
		member: PublicKey.fromBase58(memberAddress),
		provider,
		signatureAsBase58,
		contractSignatureAsBase58,
		message,
		messageAsJson: message.toJSON(),
	});

	const { proof } = await generateTransactionProof({
		contractAddress,
		receiverAddress,
		amount,
		memberAddress,
		signatureAsBase58,
	});

	console.log({ proof });

	const { hash } = await provider.sendTransaction({
		transaction: proof,
	});

	const txUrl = `https://berkeley.minaexplorer.com/transaction/${hash}`;

	worker.terminate();

	return { txUrl };
};

export { makeProposal };

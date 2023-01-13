import * as tmp from "snarkyjs";
import { AnonMultiSigMock as AnonMultiSig } from "contracts";
import { Mina, PublicKey, fetchAccount, isReady } from "snarkyjs";

window.snarkyjs = tmp;

const createAnonMultiSigContract = async (): Promise<{
	zkAppAccount: Awaited<ReturnType<typeof fetchAccount>>["account"];
	zkAppAddress: ReturnType<typeof PublicKey["fromBase58"]>;
	zkAppInstance: AnonMultiSig;
}> => {
	// const { HelloWorld } = await import("smartcontracts");

	await isReady;

	const Berkeley = Mina.Network(
		"https://proxy.berkeley.minaexplorer.com/graphql",
	);
	Mina.setActiveInstance(Berkeley);

	const zkAppAddress = PublicKey.fromBase58(
		"B62qppADTWBiiQZMxhejakZ6Vbog4tFZNsTM7bPiZ3UzSBwzNZhD81r",
	);
	const zkAppInstance = new AnonMultiSig(zkAppAddress);
	await AnonMultiSig.compile();

	const response = await fetchAccount({ publicKey: zkAppAddress });

	console.log({ where: "createAnonMultiSigContract", response });

	if (response.error) {
		throw Error(response.error.statusText);
	}

	return {
		zkAppInstance,
		zkAppAddress,
		zkAppAccount: response.account,
	};
};

export { createAnonMultiSigContract };

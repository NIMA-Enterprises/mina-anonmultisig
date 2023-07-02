import { AnonMultiSigMock as AnonMultiSig } from "contracts";
import { Mina, PublicKey, fetchAccount } from "snarkyjs";

const createAnonMultiSigContract = async ({
	contractAddress,
	skipCompile = false,
}: {
	contractAddress: string;
	skipCompile?: boolean;
}): Promise<{
	zkAppAccount: Awaited<ReturnType<typeof fetchAccount>>["account"];
	zkAppAddress: ReturnType<typeof PublicKey["fromBase58"]>;
	zkAppInstance: AnonMultiSig;
}> => {
	const Berkeley = Mina.Network(
		"https://proxy.berkeley.minaexplorer.com/graphql",
	);
	Mina.setActiveInstance(Berkeley);

	const zkAppAddress = PublicKey.fromBase58(contractAddress);
	const zkAppInstance = new AnonMultiSig(zkAppAddress);

	if (!skipCompile) {
		await AnonMultiSig.compile();
	}

	const response = await fetchAccount({ publicKey: zkAppAddress });

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

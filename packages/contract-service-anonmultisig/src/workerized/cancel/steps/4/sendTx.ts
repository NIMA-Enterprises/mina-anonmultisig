import type MinaProvider from "@aurowallet/mina-provider";
import { wagmiClient } from "wallet-connection";

const sendTx = async ({ proof }: { proof: string }) => {
	const provider =
		(await wagmiClient.connector?.getProvider()) as MinaProvider;

	const { hash } = await provider.sendTransaction({
		transaction: proof,
	});

	return { hash };
};

export { sendTx };

import Client from "mina-signer";
import { wagmiClient } from "wallet-connection";

const client = new Client({ network: "testnet" });

const signMessage = async ({ message }: { message: string }) => {
	if (!wagmiClient.connector) {
		throw new Error("No wagmi connector found");
	}

	if (!window.mina) {
		throw new Error("No mina provider found");
	}

	// const signature = "HARDCODED_CLIENT_SIGNATURE";

	// const { signature } = await window.mina.signMessage({
	// 	message,
	// });

	const { signature } = client.signMessage(message, {
		privateKey: window.PRIVATE_KEY,
		publicKey: window.PUBLIC_KEY,
	});

	return signature;
};

declare global {
	interface Window {
		signMessage: typeof signMessage;
	}
}

window.signMessage = signMessage;

export { signMessage };

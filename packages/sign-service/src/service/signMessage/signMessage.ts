import { wagmiClient } from "wallet-connection";

const signMessage = async ({ message }: { message: string }) => {
	if (!wagmiClient.connector) {
		throw new Error("No wagmi connector found");
	}

	if (!window.mina) {
		throw new Error("No mina provider found");
	}

	const signature = "HARDCODED_CLIENT_SIGNATURE";

	// const { signature } = await window.mina.signMessage({
	// 	message,
	// });

	return signature;
};

declare global {
	interface Window {
		signMessage: typeof signMessage;
	}
}

window.signMessage = signMessage;

export { signMessage };

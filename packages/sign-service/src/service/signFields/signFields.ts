import { Field, Signature } from "snarkyjs";
import { wagmiClient } from "wallet-connection";

const signFields = async ({ message }: { message: Field }) => {
	if (!wagmiClient.connector) {
		throw new Error("No wagmi connector found");
	}

	if (!window.mina) {
		throw new Error("No mina provider found");
	}

	const { signature } = await window.mina.signFields({
		message: [message.toString()],
	});

	return Signature.fromBase58(signature);
};

export { signFields };

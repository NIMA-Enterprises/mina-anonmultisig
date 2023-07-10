import { generateMessageHash } from "../1/generateMessageHash";
import { signFields } from "sign-service";
import { Field } from "snarkyjs";

const signMessage = async ({
	messageHash,
}: Awaited<ReturnType<typeof generateMessageHash>>) => {
	const signatureAsBase58 = (
		await signFields({ message: Field.fromJSON(messageHash) })
	).toBase58();

	return { signatureAsBase58 };
};

export { signMessage };

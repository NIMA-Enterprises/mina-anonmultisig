import { generateCancelMessageHash } from "../1/generateCancelMessageHash";
import { signFields } from "sign-service";
import { Field } from "snarkyjs";

const signMessage = async ({
	messageHash,
}: Awaited<ReturnType<typeof generateCancelMessageHash>>) => {
	const signatureAsBase58 = (
		await signFields({ message: Field.fromJSON(messageHash) })
	).toBase58();

	return { signatureAsBase58 };
};

export { signMessage };

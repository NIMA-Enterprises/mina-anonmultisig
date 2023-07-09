import { generateVoteMessageHash } from "../1/generateVoteMessageHash";
import { signFields } from "sign-service";
import { Field } from "snarkyjs";

const signMessage = async ({
	messageHash,
}: Awaited<ReturnType<typeof generateVoteMessageHash>>) => {
	const signatureAsBase58 = (
		await signFields({ message: Field.fromJSON(messageHash) })
	).toBase58();

	return { signatureAsBase58 };
};

export { signMessage };

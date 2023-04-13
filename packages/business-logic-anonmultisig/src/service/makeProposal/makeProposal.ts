import { generateMessageHash } from "contract-service-anonmultisig";
import { signFields } from "sign-service/src";

window.signFields = signFields;

const makeProposal = async ({
	contractAddress,
	receiverAddress,
	amount,
}: {
	contractAddress: string;
	receiverAddress: string;
	amount: number;
}) => {
	const message = await generateMessageHash({
		contractAddress,
		receiverAddress,
		amount,
	});

	console.log({ message });

	const signature = await signFields({ message });

	return { signature };
};

export { makeProposal };

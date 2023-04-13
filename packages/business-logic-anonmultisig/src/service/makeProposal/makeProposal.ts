import { getWitnessBackend } from "backend-service-anonmultisig/src";
import { generateProposalHash } from "contract-service-anonmultisig/src/pure";
import { generateMessageHash } from "contract-service-anonmultisig/src/workerized";
import { signFields } from "sign-service/src";
import { PublicKey } from "snarkyjs";
import { wagmiClient } from "wallet-connection/src";

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
	const { proposalHash } = generateProposalHash({ receiverAddress, amount });

	const memberAddress =
		(await wagmiClient.connector?.getAccount()) as any as string;

	const member = PublicKey.fromBase58(memberAddress);

	const path = await getWitnessBackend({ memberAddress });

	const message = await generateMessageHash({
		contractAddress,
		receiverAddress,
		amount,
	});

	const signature = await signFields({ message });

	return { signature, path, member, proposalHash };
};

export { makeProposal };

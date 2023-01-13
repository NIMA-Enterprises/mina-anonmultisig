import { getVoteSignature } from "backend-service-vote";
import { signMessage } from "sign-service";

const vote = async ({
	organizationId,
	userAddress,
}: {
	organizationId: string;
	userAddress: string;
}) => {
	const clientSignature = await signMessage({ message: "I want to vote" });
	const { signature: backendSignature } = await getVoteSignature({
		signature: clientSignature,
		organizationId,
		userAddress,
	});

	console.log({ clientSignature, backendSignature });

	return { signature: backendSignature };
};

declare global {
	interface Window {
		vote: typeof vote;
	}
}

window.vote = vote;

export { vote };

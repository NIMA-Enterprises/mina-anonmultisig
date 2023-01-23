import React from "react";

import { useResetMutation } from "contract-service-anonmultisig";
import { Button } from "flowbite-react";
import { useMakeProposalMutation } from "hybrid-service-vote";
import { useAccount } from "wagmi";

const OrganizationsPage = () => {
	const { address, isConnected } = useAccount();
	const [reset, { isLoading: resetIsLoading }] = useResetMutation();
	const [makeProposal, { isLoading, isError, data }] =
		useMakeProposalMutation();
	const clickHandler = () => {
		if (!isConnected || !address) {
			return;
		}

		makeProposal({
			contractAddress:
				"B62qppADTWBiiQZMxhejakZ6Vbog4tFZNsTM7bPiZ3UzSBwzNZhD81r",
			memberPublicKeyString: address,
		});
	};
	return (
		<div className="min-h-screen flex justify-center items-center">
			<div className="px-4 min-w-[20rem] max-w-lg min-h-[20rem] bg-slate-800 flex flex-col gap-4 justify-center items-center rounded-lg">
				<Button onClick={() => reset()} disabled={isLoading}>
					{isLoading ? "Reseting state" : "Reset state"}
				</Button>
				<Button onClick={clickHandler}>Vote</Button>
				<h1 className="text-white">
					Signature: {JSON.stringify(data?.signature)}
				</h1>
			</div>
		</div>
	);
};

export { OrganizationsPage };

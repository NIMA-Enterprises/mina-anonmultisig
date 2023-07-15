import React from "react";

import { useModalManager } from "@components/ethereals/ModalsWrapper";
import { Button } from "@components/molecules";
import {
	useIsAddressMemberOfOrganisationQuery,
	useReadStateFieldsQuery,
} from "business-logic-anonmultisig";
import { useAccount } from "wagmi";

const UpVoteButton: React.FC<{
	contractAddress: string;
}> = ({ contractAddress }) => {
	const { modalManager } = useModalManager();

	const stateFieldsQuery = useReadStateFieldsQuery({ contractAddress });

	const { address: userAddress, isConnected } = useAccount();
	const isMemberQuery = useIsAddressMemberOfOrganisationQuery(
		{
			contractAddress,
			userAddress: userAddress as string,
		},
		{ skip: !isConnected },
	);

	const isDisabled = (() => {
		if (!isConnected) {
			return true;
		}

		if (!stateFieldsQuery.isSuccess) {
			return true;
		}

		if (!isMemberQuery.isSuccess) {
			return true;
		}

		if (!isMemberQuery.data.isMember) {
			return true;
		}

		const { proposalHash } = stateFieldsQuery.data;

		console.log({ proposalHash });

		return proposalHash === "0";
	})();
	return (
		<Button
			onClick={() =>
				modalManager.open("VoteModal", {
					contractAddress,
					isUpVote: true,
				})
			}
			disabled={isDisabled}
		>
			<Button.Text>UpVoteButton</Button.Text>
		</Button>
	);
};

export { UpVoteButton };

import React from "react";

import { useModalManager } from "@components/ethereals/ModalsWrapper";
import { Button } from "@components/molecules";
import {
	useCountVotesQuery,
	useIsAddressMemberOfOrganisationQuery,
	useReadStateFieldsQuery,
} from "business-logic-anonmultisig";
import { useAccount } from "wagmi";

const CancelButton: React.FC<{
	contractAddress: string;
}> = ({ contractAddress }) => {
	const { modalManager } = useModalManager();

	const stateFieldsQuery = useReadStateFieldsQuery({ contractAddress });

	const countVotesQuery = useCountVotesQuery({ contractAddress });

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

		if (!countVotesQuery.isSuccess) {
			return true;
		}

		if (!isMemberQuery.isSuccess) {
			return true;
		}

		if (!isMemberQuery.data.isMember) {
			return true;
		}

		const minimalQuorum = +stateFieldsQuery.data.minimalQuorum;
		const downVotesCount = countVotesQuery.data.downVotesCount;

		return downVotesCount < minimalQuorum;
	})();
	return (
		<Button
			onClick={() =>
				modalManager.open("CancelModal", {
					contractAddress,
				})
			}
			disabled={isDisabled}
		>
			<Button.Text>Cancel</Button.Text>
		</Button>
	);
};

export { CancelButton };

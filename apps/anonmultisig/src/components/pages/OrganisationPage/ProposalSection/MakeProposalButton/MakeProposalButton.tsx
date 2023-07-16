import React from "react";

import { useModalManager } from "@components/ethereals/ModalsWrapper";
import { Button } from "@components/molecules";

const MakeProposalButton: React.FC<{
	contractAddress: string;
	receiverAddress: string;
	amount: number;
}> = ({ contractAddress, receiverAddress, amount }) => {
	const { modalManager } = useModalManager();
	return (
		<Button
			onClick={() =>
				modalManager.open("MakeProposalModal", {
					contractAddress,
					receiverAddress,
					amount,
				})
			}
		>
			<Button.Text>Make Proposal</Button.Text>
		</Button>
	);
};

export { MakeProposalButton };

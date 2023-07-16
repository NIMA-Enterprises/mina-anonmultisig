import React from "react";

import { FullScreenModal } from "../FullScreenModal";
import { useModalManager } from "@components/ethereals/ModalsWrapper";
import type { IModal } from "@components/organisms/Modal/ModalManager";
import { useMakeProposal } from "business-logic-anonmultisig";
import type { GetEndpointArgType } from "src/redux/store";

const MakeProposalModal: IModal<"MakeProposalModal"> &
	React.FC<GetEndpointArgType<"makeProposalStep1">> = ({
	contractAddress,
	receiverAddress,
	amount,
}) => {
	const { modalManager } = useModalManager();
	const {
		makeProposal,
		steps,
		isLoading,
		isUninitialized,
		isError,
		isSuccess,
		error,
	} = useMakeProposal();

	return (
		<FullScreenModal
			name="Make Proposal"
			onClose={() => {
				modalManager.close("MakeProposalModal");
			}}
			startMutation={async () => {
				const { txUrl } = await makeProposal({
					contractAddress,
					receiverAddress,
					amount,
				});

				return { txUrl };
			}}
			steps={steps}
			isError={isError}
			isSuccess={isSuccess}
			isLoading={isLoading}
			isUninitialized={isUninitialized}
			error={error}
		/>
	);
};

MakeProposalModal.modalName = "MakeProposalModal";

export { MakeProposalModal };

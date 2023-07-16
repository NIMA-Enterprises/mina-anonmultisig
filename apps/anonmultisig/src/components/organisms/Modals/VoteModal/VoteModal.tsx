import React from "react";

import { FullScreenModal } from "../FullScreenModal";
import { useModalManager } from "@components/ethereals/ModalsWrapper";
import type { IModal } from "@components/organisms/Modal/ModalManager";
import { useVote } from "business-logic-anonmultisig";
import type { GetEndpointArgType } from "src/redux/store";

const VoteModal: IModal<"VoteModal"> &
	React.FC<GetEndpointArgType<"voteStep1">> = ({
	contractAddress,
	isUpVote,
}) => {
	const { modalManager } = useModalManager();
	const {
		vote,
		steps,
		isLoading,
		isUninitialized,
		isError,
		isSuccess,
		error,
	} = useVote();

	return (
		<FullScreenModal
			name="Vote"
			onClose={() => {
				modalManager.close("VoteModal");
			}}
			startMutation={async () => {
				const { txUrl } = await vote({
					contractAddress,
					isUpVote,
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

VoteModal.modalName = "VoteModal";

export { VoteModal };

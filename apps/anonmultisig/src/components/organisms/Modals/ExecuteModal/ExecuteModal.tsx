import React from "react";

import { FullScreenModal } from "../FullScreenModal";
import { useModalManager } from "@components/ethereals/ModalsWrapper";
import type { IModal } from "@components/organisms/Modal/ModalManager";
import { useExecute } from "business-logic-anonmultisig";

const ExecuteModal: IModal<"ExecuteModal"> &
	React.FC<{
		contractAddress: string;
		receiverAddress: string;
		amount: number;
	}> = ({ contractAddress, receiverAddress, amount }) => {
	const { modalManager } = useModalManager();
	const {
		execute,
		steps,
		isLoading,
		isUninitialized,
		isError,
		isSuccess,
		error,
	} = useExecute();

	return (
		<FullScreenModal
			name="Execute"
			onClose={() => {
				modalManager.close("ExecuteModal");
			}}
			startMutation={async () => {
				const { txUrl } = await execute({
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

ExecuteModal.modalName = "ExecuteModal";

export { ExecuteModal };

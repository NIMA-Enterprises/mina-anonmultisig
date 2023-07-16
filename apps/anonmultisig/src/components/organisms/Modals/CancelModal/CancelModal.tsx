import React from "react";

import { FullScreenModal } from "../FullScreenModal";
import { useModalManager } from "@components/ethereals/ModalsWrapper";
import type { IModal } from "@components/organisms/Modal/ModalManager";
import { useCancel } from "business-logic-anonmultisig";
import type { GetEndpointArgType } from "src/redux/store";

const CancelModal: IModal<"CancelModal"> &
	React.FC<GetEndpointArgType<"cancelStep1">> = ({ contractAddress }) => {
	const { modalManager } = useModalManager();
	const {
		cancel,
		steps,
		isLoading,
		isUninitialized,
		isError,
		isSuccess,
		error,
	} = useCancel();

	return (
		<FullScreenModal
			name="Cancel"
			onClose={() => {
				modalManager.close("CancelModal");
			}}
			startMutation={async () => {
				const { txUrl } = await cancel({
					contractAddress,
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

CancelModal.modalName = "CancelModal";

export { CancelModal };

import React from "react";

import type { IModal } from "@components/organisms";
import { Modal } from "@components/organisms";

const NewFeaturesModal: IModal<"NewFeaturesModal"> &
	React.FC<{
		steps: {
			id: number;
			title: string;
		}[];
	}> = () => {
	return (
		<Modal className="min-h-[400px] min-w-[400px] bg-white">
			<Modal.Step>
				<div>
					<h1>NewFeaturesModal</h1>
				</div>
			</Modal.Step>
			<Modal.Step>
				<div>
					<h1>NewFeaturesModal</h1>
				</div>
			</Modal.Step>
		</Modal>
	);
};

NewFeaturesModal.modalName = "NewFeaturesModal";

export { NewFeaturesModal };

import React from "react";

import { configureModalManager } from "@components/organisms";
import { CancelModal } from "@components/organisms/Modals/CancelModal/CancelModal";
import { ExecuteModal } from "@components/organisms/Modals/ExecuteModal/ExecuteModal";
import { MakeProposalModal } from "@components/organisms/Modals/MakeProposalModal/MakeProposalModal";
import { VoteModal } from "@components/organisms/Modals/VoteModal/VoteModal";

const { ModalManager, useModalManager } = configureModalManager([
	MakeProposalModal,
	VoteModal,
	ExecuteModal,
	CancelModal,
]);

const ModalsWrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
	<ModalManager>{children}</ModalManager>
);

export { ModalsWrapper, useModalManager };

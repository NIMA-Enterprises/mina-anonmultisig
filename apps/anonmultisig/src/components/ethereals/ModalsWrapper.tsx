import React from "react";

import { NewFeaturesModal, configureModalManager } from "@components/organisms";

const { ModalManager, useModalManager } = configureModalManager([
	NewFeaturesModal,
]);

const ModalsWrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
	<ModalManager>{children}</ModalManager>
);

export { ModalsWrapper, useModalManager };

import React from "react";

import { useModalContext } from "../ModalContext";
import { cx } from "src/utils";

const ModalStep: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	const { showButtons, showStepCircles } = useModalContext();

	const stepClassname = cx(className);

	return <div className={stepClassname}>{children}</div>;
};

export { ModalStep };

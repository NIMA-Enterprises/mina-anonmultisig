import { twMerge } from "tailwind-merge";

import React from "react";

import { useModalContext } from "../ModalContext";

const ModalStep: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	const { showButtons, showStepCircles } = useModalContext();

	const stepClassname = twMerge(className);

	return <div className={stepClassname}>{children}</div>;
};

export { ModalStep };

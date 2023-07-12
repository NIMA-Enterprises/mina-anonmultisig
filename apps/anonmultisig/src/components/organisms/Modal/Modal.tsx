import React from "react";
import Children from "react-children-utilities";

import { ModalContext } from "./ModalContext";
import { ModalStep } from "./ModalStep";
import { cx } from "src/utils";

type ModalStepReactElement = React.ReactElement<
	React.ComponentProps<typeof ModalStep>,
	typeof ModalStep
>;

const Modal: React.FC<{
	children: ModalStepReactElement[];
	className?: string;
	showButtons?: boolean;
	showStepCircles?: boolean;
}> & {
	Step: typeof ModalStep;
} = ({
	children,
	className = "",
	showButtons = false,
	showStepCircles = false,
}) => {
	const numberOfSteps = Children.count(children);

	const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(0);

	const currentStepChildren = Children.filter(
		children,
		(childrenStepElement, index) => currentStepIndex === index,
	);

	const goToNextStep = React.useCallback(() => {
		setCurrentStepIndex((previousStepIndex) => {
			if (previousStepIndex >= numberOfSteps - 1) {
				return previousStepIndex;
			}

			return previousStepIndex + 1;
		});
	}, [currentStepIndex]);

	const goToPreviousStep = React.useCallback(() => {
		setCurrentStepIndex((previousStepIndex) => {
			if (previousStepIndex <= 0) {
				return 0;
			}

			return previousStepIndex - 1;
		});
	}, [currentStepIndex]);

	const contextValue = React.useMemo<React.ContextType<typeof ModalContext>>(
		() => ({
			showButtons,
			showStepCircles,
			goToNextStep,
			goToPreviousStep,
		}),
		[showButtons, showStepCircles],
	);

	const modalClassnames = cx("", className);

	return (
		<ModalContext.Provider value={contextValue}>
			<div className={modalClassnames}>{currentStepChildren}</div>
		</ModalContext.Provider>
	);
};

Modal.Step = ModalStep;

export { Modal };

import type { PropsWithChildren } from "react";
import type React from "react";
import { createContext, useContext } from "react";

import type { Modal } from "./Modal";

const ModalContext = createContext<{
	showButtons?: React.ComponentProps<typeof Modal>["showButtons"];
	showStepCircles?: React.ComponentProps<typeof Modal>["showStepCircles"];
	goToNextStep: () => void;
	goToPreviousStep: () => void;
} | null>(null);

const useModalContext = () => {
	const ctx = useContext(ModalContext);

	if (!ctx) {
		throw new Error(
			"useModalContext has to be used within <ModalContext.Provider>",
		);
	}

	return ctx;
};

const useModalControls = () => {
	const { goToNextStep, goToPreviousStep } = useModalContext();
	return {
		goToNextStep,
		goToPreviousStep,
	};
};

export { ModalContext, useModalContext, useModalControls };

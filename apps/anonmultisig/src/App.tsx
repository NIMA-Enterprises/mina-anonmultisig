import React from "react";

import { AppRoutes } from "./components/ethereals/AppRoutes";
import { createAnonMultiSigContract } from "contract-service-anonmultisig";
import { reset } from "contract-service-anonmultisig/src/service";

window.reset = reset;
window.createAnonMultiSigContract = createAnonMultiSigContract;

const test = async () => {
	const { zkAppInstance } = await createAnonMultiSigContract();

	// zkAppInstance.
};

const App: React.FC = () => {
	return <AppRoutes />;
};

export { App };

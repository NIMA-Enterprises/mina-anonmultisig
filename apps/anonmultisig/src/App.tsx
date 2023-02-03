import React from "react";

import { AppRoutes } from "./components/ethereals/AppRoutes";
import { createAnonMultiSigContract } from "contract-service-anonmultisig";
// import { reset } from "contract-service-anonmultisig/src/service";
import { makeProposal } from "hybrid-service-vote";

// window.reset = reset;
window.createAnonMultiSigContract = createAnonMultiSigContract;
console.log({ where: "App", makeProposal });

const App: React.FC = () => {
	return <AppRoutes />;
};

export { App };

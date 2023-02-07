import React from "react";

import { AppRoutes } from "./components/ethereals/AppRoutes";
import { createAnonMultiSigContract } from "contract-service-anonmultisig";
// import { reset } from "contract-service-anonmultisig/src/service";
import { makeProposal } from "hybrid-service-vote";

window.PRIVATE_KEY = "";
window.PUBLIC_KEY = "";

window.setKeys = ({
	privateKey,
	publicKey,
}: {
	privateKey: string;
	publicKey: string;
}) => {
	window.PRIVATE_KEY = privateKey;
	window.PUBLIC_KEY = publicKey;
};

// window.reset = reset;
window.createAnonMultiSigContract = createAnonMultiSigContract;
console.log({ where: "App", makeProposal });

const App: React.FC = () => {
	return <AppRoutes />;
};

export { App };

import React from "react";

import { AppRoutes } from "./components/ethereals/AppRoutes";
import { validateEnvironment } from "./validateEnvironment";

validateEnvironment();

const App: React.FC = () => {
	return <AppRoutes />;
};

export { App };

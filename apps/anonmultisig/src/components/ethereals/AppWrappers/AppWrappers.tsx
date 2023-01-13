import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";

import { store } from "src/redux/store";
import { Web3Provider } from "wallet-connection";

const AppWrappers: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<Provider store={store}>
			<Web3Provider>{children}</Web3Provider>
		</Provider>
	);
};
export { AppWrappers };

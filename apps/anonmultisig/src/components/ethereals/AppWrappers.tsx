import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";

import { store } from "../../redux/store";
import { ModalsWrapper } from "./ModalsWrapper";
import { Web3Provider, rainbowkitStyles } from "wallet-connection";

// @ts-ignore Prevent dead code elimination of rainbowkitStyles
window.rainbowkitStyles = rainbowkitStyles;

const AppWrappers: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<Provider store={store}>
			<Web3Provider>
				<ModalsWrapper>{children}</ModalsWrapper>
			</Web3Provider>
		</Provider>
	);
};
export { AppWrappers };

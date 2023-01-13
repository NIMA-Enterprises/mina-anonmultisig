import "@rainbow-me/rainbowkit/styles.css";

import React from "react";

import { chains, wagmiClient } from "./client";
import {
	RainbowKitProvider,
	darkTheme,
	lightTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";

const Web3Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				chains={chains}
				// avatar={() => null}
				modalSize="compact"
				theme={{ darkMode: darkTheme(), lightMode: lightTheme() }}
			>
				{children}
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export { Web3Provider };

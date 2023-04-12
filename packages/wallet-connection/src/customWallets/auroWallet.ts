import img from "../../auroWalletLogo.ico";
import { auroConnector } from "../connectors/auroConnector";
import type { Wallet } from "@rainbow-me/rainbowkit";
import type { Chain } from "wagmi";

export interface IMyWalletOptions {
	chains: Chain[];
}

const auroWallet = (): Wallet => ({
	id: "auroConnector",
	name: "Auro Wallet",
	iconUrl: img,
	iconBackground: "#fff",
	createConnector: () => {
		return {
			connector: auroConnector,
		};
	},
});

export { auroWallet };

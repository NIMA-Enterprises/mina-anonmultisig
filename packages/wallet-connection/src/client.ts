import * as ethers from "ethers";
import { currentChain } from "./chains";
import { auroWallet } from "./customWallets";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
	[currentChain],
	[
		// alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
		publicProvider(),
	],
);

const connectors = connectorsForWallets([
	{
		groupName: "Recommended",
		wallets: [auroWallet()],
	},
]);

const client = createClient({
	connectors,
	provider,
});

declare global {
	interface Window {
		wagmiClient: typeof client;
		ethers: typeof ethers;
	}
}

window.wagmiClient = client;
window.ethers = ethers;

export { client as wagmiClient, chains };

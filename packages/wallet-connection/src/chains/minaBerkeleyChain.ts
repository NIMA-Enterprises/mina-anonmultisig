import { Chain } from "wagmi";

const minaBerkeleyChain: Chain = {
	id: 0,
	name: "BerkeleyTestnet",
	network: "berkeleyTestnet",
	rpcUrls: {
		default: "https://proxy.berkeley.minaexplorer.com/graphql",
	},
	blockExplorers: {
		default: {
			name: "MinaExplorer",
			url: "https://berkeley.minaexplorer.com/",
		},
	},
	testnet: false,
};

export { minaBerkeleyChain };

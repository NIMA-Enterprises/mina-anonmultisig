import { minaBerkeleyChain } from "../chains/minaBerkeleyChain";
import type MinaProvider from "@aurowallet/mina-provider";
import type { Signer } from "ethers";
import type { Chain, ConnectorData } from "wagmi";
import { Connector, ConnectorNotFoundError } from "wagmi";

declare global {
	interface Window {
		mina?: MinaProvider;
	}
}

interface IAuroOptions {}

interface IAuroConnectorConstructorProps {
	chains: Chain[];
	options: IAuroOptions;
}

class AuroConnector extends Connector<Window["mina"], IAuroOptions> {
	get id() {
		return "auro";
	}

	get name() {
		return "Auro";
	}

	readonly ready = typeof window != "undefined" && !!window.mina;

	#provider?: Window["mina"];

	constructor({ chains, options }: IAuroConnectorConstructorProps) {
		super({ chains, options });

		const {} = options;
	}

	async connect(config?: {
		chainId?: number | undefined;
	}): Promise<Required<ConnectorData<MinaProvider>>> {
		try {
			const provider = await this.getProvider();
			if (!provider) throw new ConnectorNotFoundError();

			if (provider.on) {
				provider.on("accountsChanged", (accounts) =>
					this.onAccountsChanged.bind(this)(accounts),
				);
				provider.on("chainChanged", this.onChainChanged.bind(this));
				provider.on("disconnect", this.onDisconnect.bind(this));
			}

			this.emit("message", { type: "connecting" });

			const account = await this.getAccount();
			const id = await this.getChainId();

			return { account, chain: { id, unsupported: false }, provider };
		} catch (error) {
			// if (this.isUserRejectedRequestError(error))
			//   throw new UserRejectedRequestError(error)
			// if ((<RpcError>error).code === -32002)
			//   throw new ResourceUnavailableError(error)
			throw error;
		}
	}

	async disconnect(): Promise<void> {
		console.log({ where: "disconnect" });

		const provider = await this.getProvider();
		if (!provider) {
			return;
		}

		provider.removeAllListeners("accountsChanged");
		provider.removeAllListeners("disconnect");
		provider.removeAllListeners("chainChanged");
	}

	async getAccount(): Promise<string> {
		const provider = await this.getProvider();
		if (!provider) throw new ConnectorNotFoundError();
		const accounts = await provider.requestAccounts();

		if (accounts.length > 0) {
			return accounts[0];
		}

		throw new Error(
			"MyError: Wallet is not connected. mina.requestAccounts returned empty array.",
		);
	}

	async getChainId(): Promise<number> {
		return 0;
	}

	async getProvider(): Promise<Window["mina"]> {
		if (typeof window !== "undefined" && !!window.mina) {
			this.#provider = window.mina;
		}

		return this.#provider;
	}

	getSigner(config?: { chainId?: number | undefined }): Promise<Signer> {
		throw new Error("getSigner: Method not implemented.");
	}

	async isAuthorized(): Promise<boolean> {
		try {
			const provider = await this.getProvider();
			if (!provider) {
				throw new ConnectorNotFoundError();
			}
			const accounts = await provider.request({
				method: "eth_accounts",
			});
			const account = accounts[0];
			return !!account;
		} catch {
			return false;
		}
	}

	async sendTransaction<T>(): Promise<{ hash: string }> {
		return {
			hash: "",
		};
	}

	protected async onAccountsChanged(accounts: string[]): Promise<void> {
		console.log({
			"where": "onAccountsChanged",
			accounts,
			"this.disconnect": this.disconnect,
		});

		if (accounts.length === 0) {
			// const account = await this.getAccount();
			// this.emit("change", { account: });
			return;
		}
		this.emit("change", { account: accounts[0] });
	}

	protected onChainChanged(chain: number | string): void {
		console.log(`AuroConnector::onChainChanged: ${chain}`);
	}

	protected onDisconnect(error: Error): void {
		console.log(`onDisconnect: ${error}`);
		this.emit("disconnect");
		// this.emit("disconnect");
	}
}

const auroConnector = new AuroConnector({
	chains: [minaBerkeleyChain],
	options: {},
});

export { auroConnector };

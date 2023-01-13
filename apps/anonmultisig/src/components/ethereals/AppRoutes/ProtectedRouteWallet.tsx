import type { PropsWithChildren } from "react";
import React from "react";

import { useAccount } from "wagmi";
import { ConnectButton } from "wallet-connection";

export const ProtectedRouteWallet: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const { isConnected } = useAccount();
	if (!isConnected) {
		return (
			<div className="min-h-screen flex justify-center items-center">
				<div className="bg-slate-800 flex gap-4 justify-center items-center flex-col px-10 py-8 rounded-lg max-w-lg">
					<h1 className="text-slate-200 text-center">
						Please connect your wallet to access this page
					</h1>
					<ConnectButton />
				</div>
			</div>
		);
	}

	return <React.Fragment>{children}</React.Fragment>;
};

import React from "react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "src/components/organisms/Sidebar/Sidebar";
import { ConnectButton } from "wallet-connection";

const Layout = () => {
	return (
		<div className="w-full min-h-[100vh] bg-slate-900">
			{/* <Sidebar /> */}
			<div className="fixed top-5 right-5">
				<ConnectButton />
			</div>
			<Outlet />
		</div>
	);
};

export { Layout };

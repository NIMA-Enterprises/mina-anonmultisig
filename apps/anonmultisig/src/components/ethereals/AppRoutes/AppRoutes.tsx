import type { PropsWithChildren } from "react";
import React from "react";
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromChildren,
} from "react-router-dom";

import { Layout } from "../Layout";
import { ProtectedRouteWallet } from "./ProtectedRouteWallet";
import { ConnectWalletPage } from "src/components/pages/ConnectWalletPage";
import { HomePage } from "src/components/pages/HomePage";
import { OrganizationsPage } from "src/components/pages/OrganizationsPage";

const router = createBrowserRouter(
	createRoutesFromChildren(
		<Route path="/">
			<Route index element={<HomePage />} />
			<Route path="/app" element={<Layout />}>
				<Route
					index
					element={
						<ProtectedRouteWallet>
							<OrganizationsPage />
						</ProtectedRouteWallet>
					}
				/>
			</Route>
		</Route>,
	),
);
export const AppRoutes: React.FC = () => {
	return <RouterProvider router={router} />;
};

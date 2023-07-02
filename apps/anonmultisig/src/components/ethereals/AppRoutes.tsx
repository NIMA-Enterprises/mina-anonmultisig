import React from "react";
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromChildren,
} from "react-router-dom";

import { PageTemplateWithMenuAndFooter } from "@components/ethereals/PageTemplateWithMenuAndFooter";
import { HomePage } from "@components/pages/HomePage";

const routes = createRoutesFromChildren(
	<Route path="/">
		<Route element={<PageTemplateWithMenuAndFooter />}>
			<Route path="/" element={<HomePage />} />
		</Route>
	</Route>,
);

const router = createBrowserRouter(routes);

const AppRoutes: React.FC = () => {
	return <RouterProvider router={router} />;
};

export { AppRoutes };

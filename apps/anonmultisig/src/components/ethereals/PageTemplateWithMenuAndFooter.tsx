import React from "react";
import { Outlet } from "react-router-dom";

import { cx } from "src/utils";

const PageTemplateWithMenuAndFooter = () => {
	const pageClassName = cx("min-h-screen flex flex-col", {
		"debug-screens": import.meta.env.ANONMULTISIG_IS_PROD === "false",
	});

	return (
		<div className={pageClassName}>
			{/* <Menu /> */}
			<div className="flex-grow">
				<Outlet />
			</div>
			{/* <Footer /> */}
		</div>
	);
};

export { PageTemplateWithMenuAndFooter };

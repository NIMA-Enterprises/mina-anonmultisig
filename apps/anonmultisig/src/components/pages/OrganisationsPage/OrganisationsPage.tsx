import React from "react";

import { OrganisationBackgroundImage } from "./OrganisationBackgroundImage";
import { OrganisationsGrid } from "./OrganisationsGrid";
import { cx } from "src/utils";

const OrganisationsPage = () => {
	const pageClassName = cx("min-h-screen flex flex-col bg-[#E7F2F6]");

	return (
		<div className={pageClassName}>
			<OrganisationBackgroundImage />
			<OrganisationsGrid className="mt-6" />
		</div>
	);
};

export { OrganisationsPage };

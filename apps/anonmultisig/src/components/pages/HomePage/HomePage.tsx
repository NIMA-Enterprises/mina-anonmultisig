import React from "react";

import { cx } from "src/utils";

const HomePage = () => {
	const pageClassName = cx("min-h-screen flex flex-col");

	return <div className={pageClassName}>HomePage</div>;
};

export { HomePage };

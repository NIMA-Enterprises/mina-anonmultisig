import React from "react";
import { NavLink } from "react-router-dom";

import { Button } from "flowbite-react";

const HomePage = () => {
	return (
		<div>
			<div>HomePage</div>
			<NavLink to="/app">
				<Button>Go To App</Button>
			</NavLink>
		</div>
	);
};

export { HomePage };

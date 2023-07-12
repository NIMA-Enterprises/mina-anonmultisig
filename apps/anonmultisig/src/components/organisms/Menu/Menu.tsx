import React from "react";
import { useNavigate } from "react-router-dom";

import { PageSection } from "@components/atoms";
import { Button } from "@components/molecules";
import { ConnectButton } from "wallet-connection";

const Menu = () => {
	const navigate = useNavigate();
	return (
		<PageSection className="flex flex-row justify-between items-center h-auto sm:h-20 mt-4">
			<div className="h-1 md:block hidden opacity-0 w-48 "></div>
			<div className="flex justify-between sm:justify-start md:justify-center gap-3 sm:gap-10 ">
				<Button
					type="ghost"
					onClick={() => {
						navigate("/");
					}}
					className="grow sm:grow-0 basis-1/2"
				>
					<Button.Text>Home</Button.Text>
				</Button>
				<Button
					type="ghost"
					onClick={() => {
						navigate("/organisations");
					}}
					className="grow sm:grow-0 basis-1/2"
				>
					<Button.Text>Organisations</Button.Text>
				</Button>
			</div>
			<div className="w-auto md:w-48 flex flex-row-reverse ">
				<ConnectButton />
			</div>
		</PageSection>
	);
};

export { Menu };

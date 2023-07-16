import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PageSection } from "@components/atoms";
import { Button } from "@components/molecules";
import { cx } from "src/utils";
import { ConnectButton } from "wallet-connection";

const Menu = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	return (
		<div
			className={cx("flex justify-center", {
				"bg-[#E7F2F6]": pathname !== "/",
				"bg-transparent": pathname === "/",
			})}
		>
			<PageSection className="flex flex-row justify-between items-center h-auto sm:h-20">
				<div className="h-1 md:block hidden opacity-0 w-48 basis-1/3"></div>
				<div className="flex justify-between gap-3 sm:gap-10 basis-1/3">
					<Button
						type="ghost"
						onClick={() => {
							navigate("/");
						}}
						className="grow basis-1/2"
					>
						<Button.Text>Home</Button.Text>
					</Button>
					<Button
						type="ghost"
						onClick={() => {
							navigate("/organisations");
						}}
						className="grow basis-1/2"
					>
						<Button.Text>Organisations</Button.Text>
					</Button>
				</div>
				<div className="w-auto md:w-48 flex flex-row-reverse basis-1/3">
					<ConnectButton />
				</div>
			</PageSection>
		</div>
	);
};

export { Menu };

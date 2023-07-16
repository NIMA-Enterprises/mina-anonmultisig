import React from "react";

import { BackgroundImage } from "./BackgroundImage";
import { Menu } from "@components/organisms/Menu";

const HomePage = () => {
	return (
		<div className="relative h-screen w-full flex items-end justify-start p-24">
			<div className="absolute left-0 right-0 top-0 z-10">
				<Menu />
			</div>
			<BackgroundImage className="absolute inset-0 z-0" />
			<div className="z-10 basis-3/5">
				<h1 className="font-bold text-[#2d2d2d] text-[80px]">
					AnonMultiSig
				</h1>
				<h2 className="text-[#2d2d2d] text-[48px] leading-[56px]">
					Presenting an advanced privacy and security solution for
					Web3, fortified by the utilization of zero knowledge proofs!
				</h2>
			</div>
		</div>
	);
};

export { HomePage };

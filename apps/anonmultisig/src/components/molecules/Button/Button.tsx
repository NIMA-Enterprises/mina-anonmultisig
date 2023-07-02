import { twMerge } from "tailwind-merge";

import React from "react";

import type { IButtonProps } from "./Button.types";
import { ButtonContextProvider } from "./ButtonContext";
import { ButtonIcon } from "./ButtonIcon";
import { ButtonText } from "./ButtonText";

const Button: React.FC<IButtonProps> & {
	Icon: typeof ButtonIcon;
	Text: typeof ButtonText;
} = (props) => {
	const {
		children,
		className,
		onClick,
		size = "md",
		type = "primary",
		disabled = false,
	} = props;

	const buttonClassnames = twMerge(
		"cursor-pointer group w-fit rounded-xl flex flex-row justify-center items-center outline-transparent ring-inset gap-2",
		// types
		type === "primary" &&
			"bg-gradient-to-r focus:ring focus:ring-orange-700 focus:bg-pos-100 from-orange-600 via-orange-400 to-orange-600 transition-all duration-700 bg-size bg-pos-0 hover:bg-pos-100",
		type === "secondary" && "bg-black ",
		type === "light" && " bg-transparent",
		// sizes
		size === "sm" && "py-3 px-6 min-w-[160px]",
		size === "md" && "py-5 px-7 min-w-[235px]",
		size === "lg" && "py-8 px-9 min-w-[330px]",
		disabled && "cursor-not-allowed  bg-none bg-gray-400 ",
		className,
	);

	return (
		<ButtonContextProvider value={props}>
			<button
				style={{ backgroundSize: "200%" }}
				className={buttonClassnames}
				onClick={disabled ? () => {} : onClick}
				disabled={disabled}
			>
				{children}
			</button>
		</ButtonContextProvider>
	);
};

Button.Icon = ButtonIcon;
Button.Text = ButtonText;
export { Button };

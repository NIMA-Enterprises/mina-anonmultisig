import React from "react";

import type { IButtonProps } from "./Button.types";
import { ButtonContextProvider } from "./ButtonContext";
import { ButtonIcon } from "./ButtonIcon";
import { ButtonText } from "./ButtonText";
import { cx } from "src/utils";

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

	const buttonClassnames = cx(
		"cursor-pointer group w-fit rounded flex flex-row justify-center items-center outline-transparent ring-inset gap-2",
		// types

		type === "primary" &&
			"bg-gradient-to-b from-[rgba(231,242,246,0.16)] to-[rgba(231,242,246,0.01)] text-white bg-[#2D2D2D]",
		type === "ghost" && " bg-transparent",
		type === "outline" && " bg-transparent border-slate-700 border ",
		size === "md" && "h-14 px-5 py-4",
		size === "sm" && "h-9 px-5 py-4",
		size === "wrapper" && "min-w-none",
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

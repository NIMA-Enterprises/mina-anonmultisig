import type { ButtonIcon } from "./ButtonIcon";
import type { ButtonText } from "./ButtonText";

type ButtonChildrenType =
	| React.ReactElement<
			React.ComponentProps<typeof ButtonIcon>,
			typeof ButtonIcon
	  >
	| React.ReactElement<
			React.ComponentProps<typeof ButtonText>,
			typeof ButtonText
	  >
	| [
			React.ReactElement<
				React.ComponentProps<typeof ButtonIcon>,
				typeof ButtonIcon
			>,
			React.ReactElement<
				React.ComponentProps<typeof ButtonText>,
				typeof ButtonText
			>,
	  ]
	| [
			React.ReactElement<
				React.ComponentProps<typeof ButtonText>,
				typeof ButtonText
			>,
			React.ReactElement<
				React.ComponentProps<typeof ButtonIcon>,
				typeof ButtonIcon
			>,
	  ];

interface IButtonProps {
	children: ButtonChildrenType;

	onClick: () => any;
	className?: string;

	type?: "ghost" | "outline" | "primary";
	size?: "md" | "sm" | "wrapper";
	disabled?: boolean;
}

export type { IButtonProps };

import * as React from "react";
import {
	useFloating,
	autoUpdate,
	offset,
	flip,
	shift,
	useHover,
	useFocus,
	useDismiss,
	useRole,
	useInteractions,
	useMergeRefs,
	FloatingPortal,
} from "@floating-ui/react";
import type { Placement } from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useCopyToClipboard } from "usehooks-ts";
import { Icon } from "../Icon";

interface ITooltipOptions {
	placement?: Placement;
	copy?: string;
	disabled?: boolean;
}

export function useTooltip({
	placement = "top",
	copy,
	disabled = false,
}: ITooltipOptions) {
	const [open, setOpen] = React.useState(false);
	const [copiedValue, copyFn] = useCopyToClipboard();
	const [isCopied, setIsCopied] = React.useState(false);

	const handleCopy = React.useCallback(() => {
		if (typeof copy === "string") {
			copyFn(copy);
			setIsCopied(true);
		}
	}, [copy, copyFn]);

	React.useEffect(() => {
		if (isCopied) {
			setTimeout(() => {
				setIsCopied(false);
			}, 900);
		}
	}, [isCopied]);

	const data = useFloating({
		placement,
		open,
		onOpenChange: setOpen,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(5),
			flip({
				fallbackAxisSideDirection: "start",
				padding: 5,
			}),
			shift({ padding: 5 }),
		],
	});

	const context = data.context;

	const hover = useHover(context, {
		move: false,
	});
	const focus = useFocus(context, {});
	const dismiss = useDismiss(context);
	const role = useRole(context, { role: "tooltip" });

	const interactions = useInteractions([hover, focus, dismiss, role]);

	return React.useMemo(
		() => ({
			open,
			setOpen,
			...interactions,
			...data,
			handleCopy,
			isCopied,
			copy,
			disabled,
		}),
		[open, interactions, data, handleCopy, isCopied, copy, disabled],
	);
}

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = React.createContext<ContextType>(null);

export const useTooltipContext = () => {
	const context = React.useContext(TooltipContext);

	if (context == null) {
		throw new Error("Tooltip components must be wrapped in <Tooltip />");
	}

	return context;
};

const TooltipTrigger: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const context = useTooltipContext();
	const childrenRef = (children as any).ref;
	const ref = useMergeRefs([context.refs.setReference, childrenRef]);

	return (
		<button
			onClick={context.handleCopy}
			ref={ref}
			// The user can style the trigger based on the state
			data-state={context.open ? "open" : "closed"}
		>
			{children}
		</button>
	);
};

const TooltipContent: React.FC<{ content: React.ReactNode }> = ({
	content,
}) => {
	const context = useTooltipContext();
	const ref = useMergeRefs([context.refs.setFloating]);

	if (context.disabled) {
		return null;
	}

	const renderContent = () => {
		if (!context.copy) {
			return content;
		}
		return !context.isCopied ? (
			<span className="flex gap-2">
				{content}
				<Icon className="w-4 stroke-white" type="COPY" />
			</span>
		) : (
			"Copied to clipboard"
		);
	};

	return (
		<FloatingPortal>
			<AnimatePresence>
				{context.open && (
					<div
						ref={ref}
						style={{
							...context.floatingStyles,
							zIndex: 1000,
						}}
					>
						<motion.div
							style={{
								backgroundColor: "#444",
								color: "white",
								fontSize: "90%",
								padding: "4px 8px",
								borderRadius: "4px",
								boxSizing: "border-box",
								width: "max-content",
								maxWidth: "calc(100vw - 10px)",
							}}
							initial={{ opacity: 0, scale: 0.5, y: 10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.5, y: 10 }}
							transition={{ type: "spring", bounce: 0.2 }}
						>
							{renderContent()}
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</FloatingPortal>
	);
};

export const Tooltip = ({
	children,
	content,
	...options
}: ITooltipOptions & {
	children: React.ReactNode;
	content: React.ReactNode;
}) => {
	const tooltip = useTooltip(options);
	return (
		<TooltipContext.Provider value={tooltip}>
			<TooltipTrigger>{children}</TooltipTrigger>
			<TooltipContent content={content} />
		</TooltipContext.Provider>
	);
};

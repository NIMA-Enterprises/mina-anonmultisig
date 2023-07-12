import modalBackground from "./modal_background.png";

import React from "react";

import { AnimatedIllustration } from "./AnimatedIllustration";
import { Button } from "@components/molecules/Button";
import { AnimateChangeInHeight } from "@components/organisms/AnimateChangeInHeight";
import { CirclesWithText } from "@components/organisms/CirclesWithText";
import { Modal } from "@components/organisms/Modal";
import { AnimatePresence, motion } from "framer-motion";
import { cx } from "src/utils";
import { useCopyToClipboard } from "usehooks-ts";

const FullScreenModal: React.FC<{
	name: string;
	onClose: () => void;
	isSuccess: boolean;
	isError: boolean;
	isLoading: boolean;
	isUninitialized: boolean;
	startMutation: () => Promise<{ txUrl: string }>;
	steps: {
		name: string;
		description?: string;
		isSuccess: boolean;
		isError: boolean;
		isLoading: boolean;
		isUninitialized: boolean;
	}[];
	error: any;
}> = ({
	name,
	onClose,
	isError,
	isLoading,
	isSuccess,
	isUninitialized,
	startMutation,
	steps,
	error,
}) => {
	const [txUrl, setTxUrl] = React.useState<string>("");
	React.useEffect(() => {
		(async () => {
			if (isUninitialized) {
				const result = await startMutation();
				setTxUrl(result.txUrl);
			}
		})();
	}, []);

	const [copiedText, copyFn] = useCopyToClipboard();
	const [isCopied, setIsCopied] = React.useState<boolean>(false);

	const handleCopy = () => {
		copyFn(error as string);
		setIsCopied(true);

		setTimeout(() => {
			setIsCopied(false);
		}, 1600);
	};

	return (
		<Modal className="relative w-full overflow-hidden rounded-xl bg-white ">
			<Modal.Step>
				<div
					className=" w-full h-screen flex flex-col items-center justify-center bg-cover p-6"
					style={{
						backgroundImage: `url(${modalBackground})`,
					}}
				>
					<h1 className="text-center w-full text-[48px] font-bold">
						{name}
					</h1>

					<p className="text-center w-full text-[16px] max-w-[632px] mt-4 mb-20">
						Keep this tab open until all steps have been completed.
						Please note that certain steps might require some time
						to complete (5-7 minutes). You can track the progress of
						each step on the right. Your patience is greatly
						appreciated.
					</p>

					<AnimateChangeInHeight>
						<AnimatePresence mode="wait">
							{(isUninitialized || isLoading) && (
								<motion.div
									key="idleOrLoading"
									className={cx(
										"pointer-events-auto flex w-full flex-col items-center gap-4 px-6 pt-6 pb-5 opacity-100",
										{
											"pointer-events-none": isLoading,
										},
									)}
									initial={{ opacity: 1 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 1 }}
								>
									<div className="flex gap-32 items-center">
										<AnimatedIllustration className="max-w-[360px] w-full" />
										<CirclesWithText steps={steps} />
									</div>
								</motion.div>
							)}

							{isError && (
								<motion.div
									key="error"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 1 }}
									className="w-full  max-w-[540px]"
								>
									<h3 className="text-center text-xl font-bold">
										Oops, something went wrong
									</h3>
									{/* {errorElement} */}
									<p className="mt-3 text-left font-semibold text-gray-700">
										Error message:
									</p>
									<code className="mt-2 block h-36 w-full overflow-scroll rounded-md bg-slate-800 p-3 text-xs leading-6 text-gray-200">
										<span>
											{typeof error === "string"
												? error
												: "Unknown error"}
										</span>
									</code>
									<div className="mt-3 flex w-full flex-col gap-3 sm:flex-row">
										<Button
											onClick={() => {
												onClose();
											}}
											className="w-full"
										>
											<Button.Text>
												Close modal
											</Button.Text>
										</Button>
										<Button
											onClick={handleCopy}
											type="outline"
											className="w-full"
										>
											<Button.Text>
												{isCopied
													? "Error Copied"
													: "Copy Error"}
											</Button.Text>
											{!isCopied && (
												<Button.Icon type="COPY" />
											)}
										</Button>
									</div>
								</motion.div>
							)}

							{isSuccess && (
								<motion.div
									key="success"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 1 }}
									className="w-full px-6 max-w-[540px]"
								>
									<h3 className="text-center text-xl font-bold">
										Success
									</h3>
									{/* {successElement} */}
									<div className="mt-3 flex w-full  flex-col gap-3 sm:flex-row">
										<Button
											onClick={() => {
												onClose();
											}}
											className="w-full"
										>
											<Button.Text>
												Close modal
											</Button.Text>
										</Button>
										<Button
											type="outline"
											className="w-full"
											onClick={() => {
												if (!txUrl) {
													return;
												}
												// const url =
												// 	"https://berkeley.minaexplorer.com/";

												window.open(txUrl, "_blank");
											}}
										>
											<Button.Text>View Tx</Button.Text>
											<Button.Icon type="EXTERNAL_LINK" />
										</Button>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</AnimateChangeInHeight>
				</div>
			</Modal.Step>
		</Modal>
	);
};

export { FullScreenModal };

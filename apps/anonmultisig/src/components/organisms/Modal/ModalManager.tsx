import React from "react";

import { FloatingOverlay } from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { cx } from "src/utils";

export interface IModal<N> {
	modalName: N;
}

const configureModalManager = <
	ModalName extends string = any,
	DifferentPropType extends Parameters<React.FC>["0"] = any,
	M extends IModal<ModalName> & React.FC<DifferentPropType> = any,
>(
	modals: M[],
) => {
	// Remaps modals to state type
	// Example:

	// 	IModal<"AcceptOfferModal"> & React.FC<{
	//     contractAddress: string;
	//     itemId: number;
	//     asker: string;
	// }> | IModal<"RevealModal"> & React.FC<{
	//     contractAddress: string;
	// 	}>
	//
	// 	will be remapped to
	// {
	// 	AcceptOfferModal: {
	// 		modalName: "AcceptOfferModal",
	// 		props: {
	// 			contractAddress: string;
	// 			itemId: number;
	// 			asker: string;
	// 		},
	//    isOpen: boolean,
	//    jsxElement: ...
	// 	},
	// 	RevealModal: {
	// 		modalName: "RevealModal",
	// 		props: {
	// 			contractAddress: string;
	// 		},
	//    isOpen: boolean,
	//    jsxElement: ...
	// 	}
	// }

	type StateType = {
		[K in typeof modals[number] as K["modalName"]]: {
			modalName: K["modalName"];
			props: React.ComponentPropsWithoutRef<K>;
			isOpen: boolean;
			jsxElement: Omit<K, "modalName">;
		};
	};

	const useModalManagerInternal = () => {
		const stateInitializer = () => {
			const defaultState = {} as StateType;
			return modals.reduce<StateType>(
				(acc, modal) => ({
					...acc,
					[modal.modalName]: {
						isOpen: false,
						jsxElement: modal,
						props: undefined,
						modalName: modal.modalName,
					},
				}),
				defaultState,
			);
		};

		const [modalManager, setModalManager] =
			React.useState(stateInitializer);

		const openModal = <MN extends keyof StateType>(
			modalName: MN,
			props: StateType[MN]["props"],
		) => {
			if (modalName in modalManager) {
				setModalManager((prev) => {
					const modalToOpen = prev[modalName];
					return {
						...prev,
						[modalName]: {
							...modalToOpen,
							isOpen: true,
							props,
						},
					};
				});
			}
		};

		const closeModal = <MN extends keyof StateType>(modalName: MN) => {
			setModalManager((prev) => {
				const modalToOpen = prev[modalName];
				return {
					...prev,
					[modalName]: {
						...modalToOpen,
						isOpen: false,
					},
				};
			});
		};

		return { modalManager, openModal, closeModal };
	};

	const ModalManagerContext = React.createContext<{
		openModal: ReturnType<typeof useModalManagerInternal>["openModal"];
		closeModal: ReturnType<typeof useModalManagerInternal>["closeModal"];
	} | null>(null);

	const useModalManagerContext = () => {
		const ctx = React.useContext(ModalManagerContext);

		if (!ctx) {
			throw new Error(
				"useModalManagerContext has to be used within <ModalManagerContext.Provider>",
			);
		}

		return ctx;
	};

	const useModalManager = () => {
		const { closeModal, openModal } = useModalManagerContext();
		return { modalManager: { close: closeModal, open: openModal } };
	};

	const ModalFloatingOverlay: React.FC<{
		currentElement: ReturnType<
			typeof useModalManagerInternal
		>["modalManager"][keyof StateType];
	}> = ({ currentElement }) => {
		const ModalElement = currentElement.jsxElement;
		return (
			<FloatingOverlay
				className={cx("z-50", {
					"pointer-events-none": !currentElement.isOpen,
					"pointer-events-auto": currentElement.isOpen,
				})}
			>
				<AnimatePresence>
					{currentElement.isOpen && (
						<motion.div
							className=" bg-white"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ type: "spring", bounce: 0.2 }}
						>
							<motion.div
								initial={{ scale: 0.5 }}
								animate={{ scale: 1 }}
								exit={{ scale: 0.5 }}
								transition={{ type: "spring", bounce: 0.2 }}
								className="flex h-screen w-full items-center justify-center"
							>
								{/* @ts-ignore Check isReactComponent and flex render from @tanstack/table */}
								{/* @ts-ignore https://github.com/TanStack/table/blob/b9a30a109fc8c676547bd988152d6fcf2579999e/packages/react-table/src/index.tsx#L26 */}
								<ModalElement {...currentElement.props} />
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</FloatingOverlay>
		);
	};

	const ModalManager = ({
		children,
	}: {
		children: React.PropsWithChildren["children"];
	}) => {
		const { closeModal, openModal, modalManager } =
			useModalManagerInternal();

		return (
			<ModalManagerContext.Provider value={{ openModal, closeModal }}>
				{children}
				{Object.values<typeof modalManager[keyof StateType]>(
					modalManager,
				).map((el) => (
					<ModalFloatingOverlay
						key={el.modalName}
						currentElement={el}
					/>
				))}
			</ModalManagerContext.Provider>
		);
	};

	return {
		ModalManager,
		useModalManager,
	};
};

export { configureModalManager };

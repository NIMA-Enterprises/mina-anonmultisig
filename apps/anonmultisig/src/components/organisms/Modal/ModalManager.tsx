import React from "react";
import { FloatingOverlay } from "@floating-ui/react";
import { useOnClickOutside } from "usehooks-ts";

export interface IModal<N> {
	modalName: N;
}

const configureModalManager = <
	Props extends { name: string } = any,
	N1 extends string = string,
	M extends IModal<N1> & Omit<React.FC<Props>, "modalName"> = any,
>(
	modals: M[],
) => {
	type DifferentPropTypes = React.ComponentPropsWithoutRef<
		// @ts-ignore typeof modals[number] is same as React.ElementType, plus extra modalName property
		typeof modals[number]
	>;

	type DifferentNames = typeof modals[number]["modalName"];

	type NarrowUnionTypeByName<
		N extends string,
		T = DifferentPropTypes,
	> = T extends { name: N } ? T : never;

	const useModalManagerInternal = () => {
		type StateType = Record<
			DifferentNames,
			{
				isOpen: boolean;
				props:
					| Omit<NarrowUnionTypeByName<DifferentNames>, "name">
					| undefined;
				jsxElement: typeof modals[number];
				name: DifferentNames;
			}
		>;

		const stateInitializer = () => {
			const defaultState = {} as StateType;
			return modals.reduce<StateType>(
				(acc, modal) => ({
					...acc,
					[modal.modalName]: {
						isOpen: false,
						jsxElement: modal,
						props: undefined,
						name: modal.modalName,
					},
				}),
				defaultState,
			);
		};

		const [modalManager, setModalManager] =
			React.useState(stateInitializer);

		const openModal = <N extends DifferentNames>(
			name: N,
			props: Omit<NarrowUnionTypeByName<N>, "name"> extends Record<
				string,
				never
			>
				? { [x: string]: never }
				: Omit<NarrowUnionTypeByName<N>, "name">,
		) => {
			if (name in modalManager) {
				setModalManager((prev) => {
					const modalToOpen = prev[name];
					return {
						...prev,
						name: {
							...modalToOpen,
							isOpen: true,
							props,
						},
					};
				});
			}
		};

		const closeModal = (name: DifferentNames) => {
			setModalManager((prev) => {
				const modalToOpen = prev[name];
				return {
					...prev,
					name: {
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
		>["modalManager"][DifferentNames];
	}> = ({ currentElement }) => {
		const { modalManager } = useModalManager();
		const ModalElement = currentElement.jsxElement;
		const outsideClickRef = React.useRef<HTMLDivElement>(null);
		const handleClickOutside = () => {
			modalManager.close(currentElement.name);
		};
		useOnClickOutside(outsideClickRef, handleClickOutside);
		return (
			<FloatingOverlay>
				<div className="flex h-screen w-full items-center justify-center bg-[rgba(0,0,0,0.4)]">
					<div ref={outsideClickRef}>
						{/* @ts-ignore Check isReactComponent and flex render from @tanstack/table */}
						{/* @ts-ignore https://github.com/TanStack/table/blob/b9a30a109fc8c676547bd988152d6fcf2579999e/packages/react-table/src/index.tsx#L26 */}
						<ModalElement {...currentElement.props} />
					</div>
				</div>
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

		const openModals = Object.values<typeof modalManager[DifferentNames]>(
			modalManager,
		).filter(({ isOpen }) => isOpen);

		return (
			<ModalManagerContext.Provider value={{ openModal, closeModal }}>
				{children}
				{openModals.map((el) => (
					<ModalFloatingOverlay key={el.name} currentElement={el} />
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

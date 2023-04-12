import React, { useState } from "react";

interface ITabProps {
	isActive?: boolean;
	children: (isActive: boolean) => React.ReactNode;
	element: React.ReactNode;
}

interface ITabsProps {
	children: React.ReactElement<ITabProps>[];
	className?: string;
}

const Tabs = ({ children, className }: ITabsProps) => {
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<React.Fragment>
			<div className={className}>
				{children.map((child, index) => {
					const isActive = activeIndex === index;
					return (
						<button
							key={index}
							onClick={() => setActiveIndex(index)}
						>
							{child.props.children(isActive)}
						</button>
					);
				})}
			</div>
			{children[activeIndex].props.element}
		</React.Fragment>
	);
};

interface ITabType {
	Tab: React.FC<ITabProps>;
}

const Tab: React.FC<ITabProps> = ({ children, element, isActive }) => {
	return (
		<React.Fragment>
			{isActive && element}
			{children}
		</React.Fragment>
	);
};

const TabsList: ITabType & React.FC<ITabsProps & { className?: string }> = ({
	children,
	className,
}) => {
	return (
		<Tabs className={className}>
			{children.map((child) =>
				React.isValidElement(child) ? (
					<Tab key={child.key} {...child.props} />
				) : null,
			)}
		</Tabs>
	);
};

TabsList.Tab = Tab;

export { TabsList };

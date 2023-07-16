export const truncateEthAddress = (
	address: string,
	numOfChars: number = 4,
): string => {
	const truncateRegex = new RegExp(
		`^([a-zA-Z0-9]{${numOfChars}})[a-zA-Z0-9]+([a-zA-Z0-9]{${numOfChars}})$`,
	);
	const match = address.match(truncateRegex);

	if (!match) {
		return address;
	}

	return `${match[1]}…${match[2]}`;
};

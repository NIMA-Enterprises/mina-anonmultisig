/* eslint-disable @typescript-eslint/naming-convention */
import numbro from "numbro";

const removeTrailingZerosUtil = (result: string, endChars?: string): string => {
	// Ignore letters at the end of the string e.g. 10.00K should be formatted to 10K
	if (/[a-z]/i.exec(result.charAt(result.length - 1))) {
		return removeTrailingZerosUtil(
			result.slice(0, -1),
			`${result.charAt(result.length - 1)}${endChars || ""}`,
		);
	}
	if (result.endsWith(".")) {
		return `${result.slice(0, -1)}${endChars || ""}`;
	}

	if (!result.endsWith("0") || !result.includes(".")) {
		return `${result}${endChars || ""}`;
	}

	return removeTrailingZerosUtil(result.slice(0, -1), endChars);
};

const removeCommasUtil = (result: string): string => {
	if (!result.includes(",")) {
		return result;
	}
	return removeCommasUtil(result.replace(",", ""));
};

const formatPrice = ({
	num,
	decimals = 2,
	shorten = false,
	removeTrailingZeros = false,
	smallestNumber = 0,
	currencyLabel = "",
	labelPosition = "right",
	numberWithCommasLimit = 1000,
	commas = true,
}: {
	num: number;
	decimals?: number;
	shorten?: boolean;
	removeTrailingZeros?: boolean;
	smallestNumber?: number;
	currencyLabel?: string;
	labelPosition?: "left" | "right";
	numberWithCommasLimit?: number;
	commas?: boolean;
}) => {
	const formatResult = (_num: number | string) => {
		let result = _num.toString();
		if (removeTrailingZeros) {
			result = removeTrailingZerosUtil(result);
		}
		if (!commas) {
			result = removeCommasUtil(result);
		}

		if (labelPosition === "right") {
			return `${result}${currencyLabel}`;
		}

		return `${currencyLabel}${result}`;
	};

	// If number is zero
	if (num === 0) {
		return formatResult(num.toFixed(decimals));
	}
	// Invalid arg passed check
	if (typeof num !== "number" || Number.isNaN(num)) return "-";

	if (num < smallestNumber) {
		return `< ${formatResult(smallestNumber)}`;
	}
	if (num >= smallestNumber && num < 1) {
		return formatResult(num.toPrecision(decimals));
	}

	if (shorten) {
		const a =
			num >= numberWithCommasLimit
				? {
						lowPrecision: false,
				  }
				: {};

		return formatResult(
			numbro(num)
				.format({
					mantissa: decimals,
					average: num >= numberWithCommasLimit,
					...a,
				})
				.toUpperCase(),
		);
	}

	return formatResult(
		Number(num.toFixed(decimals)).toLocaleString("en-US", {
			minimumFractionDigits: decimals,
		}),
	);
};

export { formatPrice };

import { formatPrice } from "./formatPrice";

describe("Format Price tests", () => {
	test("NaN passed", () => {
		expect(formatPrice({ num: NaN })).toEqual("-");
	});

	describe("No value tests", () => {
		test("undefined passed", () => {
			expect(
				formatPrice({ num: undefined as unknown as number }),
			).toEqual("-");
		});

		test("NULL passed", () => {
			expect(formatPrice({ num: null as unknown as number })).toEqual(
				"-",
			);
		});
	});
	test("0 passed default", () => {
		expect(formatPrice({ num: 0 })).toEqual("0.00");
	});

	test("0 passed no trailing zeros", () => {
		expect(formatPrice({ num: 0, removeTrailingZeros: true })).toEqual("0");
	});

	test("0 passed no trailing zeros dollar ", () => {
		expect(
			formatPrice({
				num: 0,
				removeTrailingZeros: true,
				currencyLabel: "$",
				labelPosition: "left",
			}),
		).toEqual("$0");
	});
	test("default props", () => {
		expect(formatPrice({ num: 12.0123 })).toEqual("12.01");
	});

	test("default props", () => {
		expect(formatPrice({ num: 125.0123 })).toEqual("125.01");
	});

	test("default props commas", () => {
		expect(formatPrice({ num: 16532.0123 })).toEqual("16,532.01");
	});

	test("default props no commas", () => {
		expect(formatPrice({ num: 16532.0123, commas: false })).toEqual(
			"16532.01",
		);
	});

	test("default props no commas multiple commas", () => {
		expect(formatPrice({ num: 1623241532.0123, commas: false })).toEqual(
			"1623241532.01",
		);
	});

	test("no decimals", () => {
		expect(formatPrice({ num: 435.72912, decimals: 0 })).toEqual("436");
	});

	test("dollar value", () => {
		expect(
			formatPrice({
				num: 435.72912,
				currencyLabel: "$",
				labelPosition: "left",
			}),
		).toEqual("$435.73");
	});

	test("4 decimals", () => {
		expect(formatPrice({ num: 164.524, decimals: 4 })).toEqual("164.5240");
	});

	test("remove trailing zeros 4 decimals", () => {
		expect(
			formatPrice({
				num: 164.524,
				decimals: 4,
				removeTrailingZeros: true,
			}),
		).toEqual("164.524");
	});
	test("dollar value shorten thousands", () => {
		expect(
			formatPrice({
				num: 1000.123,
				currencyLabel: "$",
				labelPosition: "left",
				removeTrailingZeros: true,
				decimals: 2,
				shorten: true,
			}),
		).toEqual("$1K");
	});

	test("dollar value shorten thousands", () => {
		expect(
			formatPrice({
				num: 43534.72912,
				currencyLabel: "$",
				labelPosition: "left",
				shorten: true,
			}),
		).toEqual("$43.53K");
	});

	test("dollar value shorten hundred thousands", () => {
		expect(
			formatPrice({
				num: 435345.72912,
				currencyLabel: "$",
				labelPosition: "left",
				shorten: true,
			}),
		).toEqual("$435.35K");
	});
	test("dollar value shorten hundred thousands more than 500k", () => {
		expect(
			formatPrice({
				num: 635345.72912,
				currencyLabel: "$",
				labelPosition: "left",
				shorten: true,
			}),
		).toEqual("$635.35K");
	});

	test("dollar value shorten milions", () => {
		expect(
			formatPrice({
				num: 4353413.72912,
				currencyLabel: "$",
				labelPosition: "left",
				shorten: true,
			}),
		).toEqual("$4.35M");
	});

	test("dollar value shorten milions", () => {
		expect(
			formatPrice({
				num: 4303003.72912,
				currencyLabel: "$",
				labelPosition: "left",
				shorten: true,
			}),
		).toEqual("$4.30M");
	});
	test("dollar value shorten milions no trailing zeros", () => {
		expect(
			formatPrice({
				num: 4303003.72912,
				currencyLabel: "$",
				labelPosition: "left",
				shorten: true,
				removeTrailingZeros: true,
			}),
		).toEqual("$4.3M");
	});

	test("should return - if invalid arg is passed", () => {
		expect(formatPrice({ num: NaN })).toBe("-");
		expect(formatPrice({ num: "invalid" as unknown as number })).toBe("-");
	});

	test("should format number with provided precision and no dollar sign", () => {
		expect(formatPrice({ num: 5, decimals: 2 })).toBe("5.00");
		expect(formatPrice({ num: 5, decimals: 3 })).toBe("5.000");
	});

	test("should format number with provided precision and dollar sign", () => {
		expect(
			formatPrice({
				num: 5,
				decimals: 2,
				currencyLabel: "$",
				labelPosition: "left",
			}),
		).toBe("$5.00");
		expect(
			formatPrice({
				num: 5,
				decimals: 3,
				currencyLabel: "$",
				labelPosition: "left",
			}),
		).toBe("$5.000");
	});

	test("should remove trailing zeros from number", () => {
		expect(
			formatPrice({ num: 5, decimals: 2, removeTrailingZeros: true }),
		).toBe("5");
		expect(
			formatPrice({ num: 5, decimals: 3, removeTrailingZeros: true }),
		).toBe("5");
	});

	test("should show number in smaller format", () => {
		expect(
			formatPrice({
				num: 50000,
				shorten: true,
				decimals: 2,
				numberWithCommasLimit: 1000,
			}),
		).toBe("50.00K");
	});

	test("should show number with commas", () => {
		expect(
			formatPrice({
				num: 50000,
				shorten: false,
				decimals: 2,
				numberWithCommasLimit: 1000,
			}),
		).toBe("50,000.00");
	});

	test("should not show commas in number", () => {
		expect(
			formatPrice({
				num: 50000,
				shorten: false,
				decimals: 2,
				numberWithCommasLimit: 1000,
				commas: false,
			}),
		).toBe("50000.00");
	});

	test("should show numbers smaller than smallestNumber", () => {
		expect(
			formatPrice({
				num: 0.5,
				smallestNumber: 1,
				decimals: 2,
				currencyLabel: "$",
				labelPosition: "left",
			}),
		).toBe("< $1");
	});
});

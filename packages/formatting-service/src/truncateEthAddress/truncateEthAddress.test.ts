import { truncateEthAddress } from "./truncateEthAddress";

describe("Truncate Eth Address Tests", () => {
	test("Regular address no arguments", () => {
		expect(
			truncateEthAddress("0xadc4d27a18ea9961819f2d7b6f39c5d8bc0e94f6"),
		).toEqual("0xadc4…94f6");
	});

	test("Regular address with NumChar = 2", () => {
		expect(
			truncateEthAddress("0xadc4d27a18ea9961819f2d7b6f39c5d8bc0e94f6", 2),
		).toEqual("0xad…f6");
	});
});

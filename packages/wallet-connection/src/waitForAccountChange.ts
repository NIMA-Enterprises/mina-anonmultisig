import { wagmiClient } from "./client";

const waitForAccountChange = () =>
	new Promise<void>(async (resolve) => {
		const originalAccount = await wagmiClient.connectors[0].getAccount();

		if (!originalAccount) {
			return;
		}

		const intervalId = setInterval(async () => {
			const newAccount = await wagmiClient.connectors[0].getAccount();

			if (!newAccount || newAccount === originalAccount) {
				return;
			}

			clearInterval(intervalId);
			resolve();
		}, 1000);
	});

export { waitForAccountChange };

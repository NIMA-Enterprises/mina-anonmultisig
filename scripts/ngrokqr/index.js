const ngrok = require("ngrok");
const yaml = require("js-yaml");
const fs = require("fs");
const os = require("os");
const { join } = require("path");
const qrcode = require("qrcode-terminal");
const args = require("args");

args.options([
	{ name: "port", description: "Select which local port or url to expose" },
	{
		name: "authtoken",
		description:
			"Your auth token from ngrok.com, if not specified in ngrok config",
	},
]);
const flags = args.parse(process.argv);
let address = flags.port;

const getConfigPath = () => {
	switch (process.platform) {
		case "linux":
			return join(os.homedir(), ".config/ngrok/ngrok.yml");

		case "darwin":
			return join(
				os.homedir(),
				"Library/Application Support/ngrok/ngrok.yml",
			);
		case "win32":
			return join(os.homedir(), "AppDataLoca\\ngrok\\ngrok.yml");
	}
};

const getAuthToken = () => {
	try {
		return yaml.load(fs.readFileSync(getConfigPath(), "utf8"))?.authtoken;
	} catch (e) {
		console.log(e);
	}
};

const main = async () => {
	let token = flags.authtoken || getAuthToken();
	const url = await ngrok.connect({
		addr: address,
		authtoken: token,
	});

	qrcode.generate(url, { small: true });
	console.log(url);
	console.log(`ngrok http ${address}`);
};

main().catch((e) => {
	console.error(e);
});

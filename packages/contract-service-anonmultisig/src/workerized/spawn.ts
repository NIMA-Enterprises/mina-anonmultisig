import { wrap } from "comlink";

const Ready = { ready: true };

const readinessListener = (worker: Worker, callback: () => void) => {
	worker.addEventListener(
		"message",
		function ready(event: MessageEvent<typeof Ready>) {
			if (!!event.data && event.data.ready === true) {
				worker.removeEventListener("message", ready);
				callback();
			}
		},
	);
};

const spawn = async <T>(path: URL | string) => {
	const worker = new Worker(
		new URL(path, /* relative to _this_ file */ import.meta.url),
		{
			type: "module",
			name: `spawn_worker > ${path.toString()}`,
		},
	);

	const terminate = () => worker.terminate();

	await new Promise<void>((resolve) => readinessListener(worker, resolve));

	return { worker: wrap<T>(worker), terminate };
};

export { spawn, Ready };

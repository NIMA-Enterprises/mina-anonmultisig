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

const spawn = async <T>(ImportedWorker: typeof Worker) => {
	const worker = new ImportedWorker();

	const terminate = () => worker.terminate();

	await new Promise<void>((resolve) => readinessListener(worker, resolve));

	return { worker: wrap<T>(worker), terminate };
};

export { spawn, Ready };

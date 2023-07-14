// TODO: add cleanup
const loadImage = ({ src }: { src: string }) =>
	new Promise((res, rej) => {
		const img = new Image();
		img.addEventListener("load", () => res(src));
		img.addEventListener("error", (e) => rej({ message: e.message }));
		img.src = src;
	});

export { loadImage };

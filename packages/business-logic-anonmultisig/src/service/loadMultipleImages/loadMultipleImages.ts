import { loadImage } from "../loadImage";

const loadMultipleImages = ({ srcs }: { srcs: string[] }) => {
	return Promise.all(srcs.map((src) => loadImage({ src })));
};

export { loadMultipleImages };

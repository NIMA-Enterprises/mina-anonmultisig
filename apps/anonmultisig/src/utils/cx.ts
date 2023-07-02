import classNames from "classnames";
import { twMerge } from "tailwind-merge";

const cx = (...args: any[]) => twMerge(classNames(args).split(" "));

export { cx };

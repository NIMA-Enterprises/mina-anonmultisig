import styles from "./__name__.module.scss";

import * as React from "react";

import { I__name__Props } from "./__name__.types";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
export const __name__: React.FC<I__name__Props> = () => {
	return <h1 className={`${styles.__name__}`}>__name__</h1>;
};

__name__.displayName = "__name__";

import { ForwardedRef, HTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';

import styles from './Loader.module.sass';

const Loader = forwardRef(({ className, ...props }: HTMLAttributes<HTMLElement>, ref: ForwardedRef<HTMLDivElement>) => (
	<div ref={ref} className={classNames(styles.loader, className)} {...props} />
));

Loader.displayName = 'Loader';

export default Loader;

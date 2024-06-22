import { ButtonProps } from "./Button.types";

import styles from "./Button.module.sass";
import classNames from "classnames";

export default function Button({
  children,
  className,
  size = "md",
  color = "primary",
  variant = "solid",
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(
        styles.btn,
        styles[size],
        styles[variant],
        styles[color],
        { [styles["disabled"]]: disabled },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <i className={styles.icon}>{leftIcon}</i>}
      {children}
      {rightIcon && <i className={styles.icon}>{rightIcon}</i>}
    </button>
  );
}

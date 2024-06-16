import { Link } from "@remix-run/react";

import styles from "./MainLinkItem.module.sass";
import { MainLinkItemProps } from ".";

const MainLinkItem = ({
  title,
  description,
  icon: Icon,
  ...props
}: MainLinkItemProps) => (
  <Link className={styles.link} {...props}>
    <div className={styles.linkHeader}>
      <h3 className={styles.linkTitle}>{title}</h3>
      <Icon className={styles.linkIcon} />
    </div>
    <span className={styles.linkDesc}>{description}</span>
  </Link>
);

export default MainLinkItem;

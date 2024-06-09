import type { MetaFunction } from "@remix-run/node";
import { IoBook } from "react-icons/io5";

import styles from "./Index.module.sass";
import { MainLinkItem } from "../../components/MainLinkItem";
import classNames from "classnames";

export const meta: MetaFunction = () => {
  return [{ title: "KAI" }];
};

export default function Index() {
  return (
    <main className={classNames("page", styles.main)}>
      <header className={styles.header}>
        <h1 className="h1">KAI Assistant</h1>
        <span className="subtitle">
          Let KAI helps you to improve your english
        </span>
      </header>
      <section className={styles.mainLinkList}>
        <MainLinkItem
          to="/"
          title="Grammar"
          description="Helps you find the words you need⁠"
          icon={IoBook}
        />
      </section>
    </main>
  );
}

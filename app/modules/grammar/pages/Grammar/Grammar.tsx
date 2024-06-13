import classNames from "classnames";

import { RichtextEditor } from "~/components/RichtextEditor";

import styles from "./Grammar.module.sass";

{
  /* <GrammarEditorMarkButton format="bold" icon={BsTypeBold} />
    <GrammarEditorMarkButton format="italic" icon={BsTypeItalic} />
    <GrammarEditorMarkButton format="underline" icon={BsTypeUnderline} />
    <GrammarEditorMarkButton format="code" icon={BsCode} />
    <GrammarEditorBlockButton format="heading-one" icon={BsTypeH1} />
    <GrammarEditorBlockButton format="heading-two" icon={BsTypeH2} />
    <GrammarEditorBlockButton format="block-quote" icon={BsBlockquoteLeft} />
    <GrammarEditorBlockButton format="numbered-list" icon={BsListOl} />
    <GrammarEditorBlockButton format="bulleted-list" icon={BsListUl} />
    <GrammarEditorBlockButton format="left" icon={BsJustifyLeft} />
    <GrammarEditorBlockButton format="center" icon={BsTextCenter} />
    <GrammarEditorBlockButton format="right" icon={BsJustifyRight} />
    <GrammarEditorBlockButton format="justify" icon={BsJustify} /> */
}

const Grammar = () => (
  <main className={classNames("page", styles.grammar)}>
    <RichtextEditor placeholder="Type or paste your text here" />
  </main>
);

export default Grammar;

import { CSSProperties, useCallback, useEffect } from "react";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
} from "slate-react";
import {
  BsJustify,
  BsJustifyLeft,
  BsJustifyRight,
  BsListOl,
  BsListUl,
  BsTextCenter,
  BsTypeBold,
  BsTypeH1,
  BsTypeH2,
  BsTypeItalic,
  BsTypeUnderline,
} from "react-icons/bs";
import classNames from "classnames";

import styles from "./RichTextEditor.module.sass";
import {
  RichTextButtonProps,
  RichTextEditorProps,
  HOTKEYS,
  TEXT_ALIGN_TYPES,
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
} from ".";
import isHotkey, { KeyboardEventLike } from "is-hotkey";

const RichTextMarkButton = ({ format, icon: Icon }: RichTextButtonProps) => {
  const editor = useSlate();

  return (
    <button
      className={classNames(
        styles.markButton,
        isMarkActive(editor, format) && styles.active
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon />
    </button>
  );
};

const RichTextBlockButton = ({ format, icon: Icon }: RichTextButtonProps) => {
  const editor = useSlate();
  return (
    <button
      className={classNames(
        styles.blockButton,
        isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
        ) && styles.active
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon />
    </button>
  );
};

const RichTextToolbar = () => (
  <div className={styles.toolbar}>
    <RichTextMarkButton format="bold" icon={BsTypeBold} />
    <RichTextMarkButton format="italic" icon={BsTypeItalic} />
    <RichTextMarkButton format="underline" icon={BsTypeUnderline} />
    <RichTextBlockButton format="heading-one" icon={BsTypeH1} />
    <RichTextBlockButton format="heading-two" icon={BsTypeH2} />
    <RichTextBlockButton format="numbered-list" icon={BsListOl} />
    <RichTextBlockButton format="bulleted-list" icon={BsListUl} />
    <RichTextBlockButton format="left" icon={BsJustifyLeft} />
    <RichTextBlockButton format="center" icon={BsTextCenter} />
    <RichTextBlockButton format="right" icon={BsJustifyRight} />
    <RichTextBlockButton format="justify" icon={BsJustify} />
  </div>
);

export const RichTextElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const style: CSSProperties = { textAlign: element.align };

  switch (element.type) {
    case "bulleted-list":
      return (
        <ul className={styles.ul} style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 className={styles.h1} style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 className={styles.h2} style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li className={styles.li} style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol className={styles.ol} style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p className={styles.p} style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

export const RichTextLeaf = <T extends RenderLeafProps = RenderLeafProps>({
  attributes,
  children,
  leaf,
}: T) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;

  return <span {...attributes}>{children}</span>;
};

const initial = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const RichTextEditor = ({
  editor,
  initialValue = initial,
  onChange,
  onValueChange,
  className,
  renderElement = (props: RenderElementProps) => <RichTextElement {...props} />,
  renderLeaf = (props: RenderLeafProps) => <RichTextLeaf {...props} />,
  ...rest
}: RichTextEditorProps) => {
  const renderElementCallback = useCallback(renderElement, []);
  const renderLeafCallback = useCallback(renderLeaf, []);

  useEffect(() => ReactEditor.focus(editor), []);

  const handleHotkey = (event: KeyboardEventLike) => {
    for (const hotkey in HOTKEYS) {
      if (!isHotkey(hotkey, event)) return;

      const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
      toggleMark(editor, mark);
    }
  };

  return (
    <div className={classNames(styles.container, className)}>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={onChange}
        onValueChange={onValueChange}
      >
        <RichTextToolbar />
        <Editable
          {...rest}
          className={styles.editor}
          renderElement={renderElementCallback}
          renderLeaf={renderLeafCallback}
          onKeyDown={handleHotkey}
        />
      </Slate>
    </div>
  );
};

export default RichTextEditor;

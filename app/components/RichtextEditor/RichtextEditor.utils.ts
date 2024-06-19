import {
  BaseEditor,
  BaseElement,
  BaseText,
  Descendant,
  Editor,
  Element as SlateElement,
} from "slate";
import { ReactEditor } from "slate-react";
import { jsx } from "slate-hyperscript";

export const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
};

export const ELEMENT_TAGS = {
  A: (el: HTMLElement) => ({ type: "link", url: el.getAttribute("href") }),
  BLOCKQUOTE: () => ({ type: "quote" }),
  H1: () => ({ type: "heading-one" }),
  H2: () => ({ type: "heading-two" }),
  H3: () => ({ type: "heading-three" }),
  H4: () => ({ type: "heading-four" }),
  H5: () => ({ type: "heading-five" }),
  H6: () => ({ type: "heading-six" }),
  IMG: (el: HTMLElement) => ({ type: "image", url: el.getAttribute("src") }),
  LI: () => ({ type: "list-item" }),
  OL: () => ({ type: "numbered-list" }),
  P: () => ({ type: "paragraph" }),
  PRE: () => ({ type: "code" }),
  UL: () => ({ type: "bulleted-list" }),
};

// NOTE: `B` is omitted here because Google Docs uses `<b>` in weird ways.
export const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

export const LIST_TYPES = ["numbered-list", "bulleted-list"];
export const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

export const isMarkActive = (editor: BaseEditor, format: string) => {
  const marks = Editor.marks(editor);

  return marks ? marks[format as keyof typeof marks] === true : false;
};

export const isBlockActive = (
  editor: BaseEditor,
  format: string,
  blockType: "align" | "type" = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (node) =>
        !Editor.isEditor(node) &&
        SlateElement.isElement(node) &&
        node[blockType] === format,
    })
  );

  return !!match;
};

export const toggleMark = (
  editor: BaseEditor,
  format: string,
  value: unknown = true
) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    editor.removeMark(format);
  } else {
    editor.addMark(format, value);
  }
};

export const toggleBlock = (editor: BaseEditor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  editor.unwrapNodes({
    match: (node) =>
      !Editor.isEditor(node) &&
      SlateElement.isElement(node) &&
      typeof node.type === "string" &&
      LIST_TYPES.includes(node.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }

  editor.setNodes(newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    editor.wrapNodes(block);
  }
};

const deserialize = (
  el: HTMLElement
): (Descendant | null)[] | BaseElement | BaseText | null => {
  if (el.nodeType === Node.TEXT_NODE) {
    return { text: el.textContent ?? "" };
  } else if (el.nodeType !== Node.ELEMENT_NODE) {
    return null;
  } else if (el.nodeName === "BR") {
    return { text: "\n" };
  }

  const { nodeName } = el;
  const parent = el;

  let children = Array.from(parent.childNodes as NodeListOf<HTMLElement>)
    .map(deserialize)
    .flat();

  if (children.length === 0) {
    children = [{ text: "" }];
  }

  if (el.nodeName === "BODY") {
    return jsx("fragment", {}, children);
  }

  if (nodeName in ELEMENT_TAGS) {
    const attrs = ELEMENT_TAGS[nodeName as keyof typeof ELEMENT_TAGS](el);
    return jsx("element", attrs, children);
  }

  if (nodeName in TEXT_TAGS) {
    const attrs = TEXT_TAGS[nodeName as keyof typeof TEXT_TAGS]();
    return children.map((child) => jsx("text", attrs, child)) as Descendant[];
  }

  return children;
};

export const withHtml = (editor: ReactEditor) => {
  const { insertData, isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const html = data.getData("text/html");

    if (html) {
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const fragment = deserialize(parsed.body) as Descendant[];
      editor.insertFragment(fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};

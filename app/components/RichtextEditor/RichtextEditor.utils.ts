import { BaseElement, BaseText, Descendant, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { jsx } from "slate-hyperscript";

const ELEMENT_TAGS = {
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
const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
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
      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};

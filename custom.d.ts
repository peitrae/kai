import {
  BaseElement as Element,
  BaseText as Text,
  BaseRange as Range,
} from "slate";

declare module "slate" {
  export interface BaseElement extends Element {
    type?: string;
    align?: TextAlign;
  }

  export interface BaseText extends Text {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    highlight?: boolean;
  }

  export interface BaseRange extends Range {
    highlight?: boolean;
  }
}

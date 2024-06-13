import { BaseElement as Element } from "slate";

declare module "slate" {
  export interface BaseElement extends Element {
    type?: string;
    align?: string;
  }
}

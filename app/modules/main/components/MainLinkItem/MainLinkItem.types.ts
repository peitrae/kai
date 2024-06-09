import { RemixLinkProps } from "@remix-run/react/dist/components";
import { IconType } from "react-icons";

export interface MainLinkItemProps extends RemixLinkProps {
  title: string;
  description: string;
  icon: IconType;
}

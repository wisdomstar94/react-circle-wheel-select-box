import { ReactNode } from "react";

export declare namespace ICircleWheelSelectBox {
  export interface MenuItem {
    key: string;
    icon: ReactNode;
    name: ReactNode;
    onClick?: () => void;
  }

  export interface Props {
    size: number;
    innerCircleSize: number;
    innerCircleContent?: ReactNode;
    menuItems: MenuItem[];
  }
}
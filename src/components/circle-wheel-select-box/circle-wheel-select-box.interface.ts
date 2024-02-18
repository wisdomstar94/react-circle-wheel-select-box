import { ReactNode } from "react";

export declare namespace ICircleWheelSelectBox {
  export type CursorPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  export interface Coordinate {
    x: number;
    y: number;
  }

  export interface MenuItem {
    key: string;
    icon: ReactNode;
    name: ReactNode;
    value: string;
  }

  export interface PointerMoveInfo {
    client: Coordinate;
  }

  export interface Props {
    size: number;
    innerCircleSize: number;
    innerCircleContent?: ReactNode;
    menuItems: MenuItem[];
    selectedMenuItem?: MenuItem;
    defaultValue?: string;
    onClick?: (item: MenuItem) => void;
  }
}
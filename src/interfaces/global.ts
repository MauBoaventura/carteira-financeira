import { MenuProps } from "antd";

export interface IMenuItem {
    key: string;
    icon?: string; 
    label: string;
    path?: string;
    children?: IMenuItem[]; 
  }

export interface IApiResponse {
    items: IMenuItem[];
}
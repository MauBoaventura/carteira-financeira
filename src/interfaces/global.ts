import { MenuProps } from "antd";

// Representa cada item no menu
export interface IMenuItem {
    key: string;
    icon?: string; // Opcional, pois nem todos os itens possuem um ícone
    label: string;
    path?: string; // Opcional, pois nem todos os itens possuem um caminho
    children?: IMenuItem[]; // Itens filhos, caso existam
  }

export interface IApiResponse {
    items: IMenuItem[];
}
"use client"
import Image from "next/image";
import Link from "next/link";
import { Notifications } from "./components/notifications/notifications";
import { SearchInput } from "./components/search-input/search-input";
import { UserAvatar } from "./components/user-avatar/user-avatar";
import { useDeviceType } from "@/providers/device-type-provider/device-type-provider";
import { useConfiguracao } from "@/providers/configuracao-provider/configuracao-provider";
import { useTheme } from "next-themes";
import { ThemeToggle } from "../theme-toggle";
import { Avatar, Button, Space } from "antd";
import { CloseOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { useLocation } from "@/hooks";
import { UserRoles } from "@/lib/enums";
import Cookies from 'js-cookie';

interface Props {
  modules?: string[];
}


export const Header = ({ modules }: Props) => {
  const { isMobile, mobileMenuVisible, setMobileMenuVisible } = useDeviceType()
  const { collapsedSidebar, setCollapsedSidebar } = useConfiguracao()
  const { theme } = useTheme()
  const { userRole } = useLocation()
  const userName = JSON.parse(Cookies.get('user') || 'Usuário');



  const titles: Record<UserRoles, string> = {
    [UserRoles.DASHBOARD]: 'Dashboard',
    [UserRoles.DEPOSIT]: 'Depósito',
    [UserRoles.REVERSE]: 'Reversão de Operação',
    [UserRoles.TRANSFER]: 'Transferência',
  };

  return (
    <header
      id="header"
      className={`fixed top-0 z-[100] flex h-16 w-full items-center justify-between shadow-md transition-all duration-300 ${theme === 'dark' ? 'bg-[#001529]' : '!bg-white'
        } ${!isMobile && !collapsedSidebar ? 'pl-[260px]' : !isMobile ? 'pl-[90px]' : ''} px-4`}>
      <Space className='flex items-center'>
        {isMobile ? (
          <Button
            type="text"
            icon={mobileMenuVisible ? <CloseOutlined /> : <MenuUnfoldOutlined />}
            onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
          />
        ) : (
          <Button
            type="text"
            icon={collapsedSidebar ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsedSidebar(!collapsedSidebar)}
          />
        )}
        <Title level={5} className="!m-0 text-blue-100">
          {titles[userRole as UserRoles] || "Carteira VirtuALL"}
        </Title>
      </Space>
      <div className="flex items-center gap-4">

        <span className="text-sm font-medium text-gray-700">
          {userName.name}
        </span>
        <UserAvatar key="header-avatar" className="border-2 border-slate-400" />
        <ThemeToggle />
      </div>
    </header>
  );
};

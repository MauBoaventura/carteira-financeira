'use client'
import React, { useEffect, useState } from 'react';
import {
  AppstoreOutlined,
  CalendarOutlined,
  LinkOutlined,
  MailOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined, StarOutlined
} from '@ant-design/icons';
import { Button, Divider, Drawer, Flex, Menu, Switch } from 'antd';
import type { MenuProps, MenuTheme } from 'antd/es/menu';
import { useTheme } from 'next-themes';
import { IApiResponse, IMenuItem } from '@/interfaces/global';
import Link from 'next/link';
import { useLocation } from '@/hooks/use-location';
import Sider from 'antd/es/layout/Sider';
import { useConfiguracao } from '@/providers/configuracao-provider/configuracao-provider';
import Image from 'next/image';
import Title from 'antd/es/typography/Title';
import { useDeviceType } from '@/providers/device-type-provider/device-type-provider';

export type MenuItem = Required<MenuProps>['items'][number];

// Mapeamento de ícones
export const iconMap: Record<string, React.ReactNode> = {
  StarOutlined: <StarOutlined />,
  MailOutlined: <MailOutlined />,
  CalendarOutlined: <CalendarOutlined />,
  SettingOutlined: <SettingOutlined />,
  LinkOutlined: <LinkOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
  MenuUnfoldOutlined: <MenuUnfoldOutlined />,
  MenuFoldOutlined: <MenuFoldOutlined />,
};
const findItem = (items: IMenuItem[], key: string): IMenuItem | undefined => {
  for (const item of items) {
    if (item.key === key) {
      return item;
    }
    if (item.children) {
      const found = findItem(item.children, key);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

const SideBar = () => {
  const { isMobile, mobileMenuVisible, setMobileMenuVisible } = useDeviceType();
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<MenuItem[]>([])
  const { theme } = useTheme()
  const { collapsedSidebar, setCollapsedSidebar } = useConfiguracao();
  const { userRole} = useLocation();
  // Função para criar links ou rótulos
  const createLabel = (label: string, path?: string) => {
    if (path) {
      if (path.startsWith('http')) {
        return (
          <a href={path} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        );
      }
      return <Link href={`/${userRole}${path}`}>{label}</Link>;
    }
    return label;
  };


  const mapApiToMenuItem = (apiItem: IMenuItem): MenuItem => {
    const { key, icon, label, children, path } = apiItem;
    return {
      key: `sidebar-${key}`,
      icon: path ? <Link href={`/${userRole}${path}`}>{icon && iconMap[icon]}</Link> : icon ? iconMap[icon] || null : null,
      label: createLabel(label, path),
      children: children?.map(mapApiToMenuItem),
    } as MenuItem;
  };

  useEffect(() => {
    setMounted(true)
  }, [])


  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Sidebar para desktop */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsedSidebar}
          onCollapse={(value) => setCollapsedSidebar(value)}
          width={250}
          collapsedWidth={80}
          theme={theme === 'dark' ? 'dark' : 'light'}
          className={`h-screen fixed left-0 top-0 bottom-0 z-[100] shadow-[2px_0_8px_rgba(0,0,0,0.1)] !transition-all duration-300`}
        >
          <div className="p-4 flex items-center justify-center h-16">
            {!collapsedSidebar ? (
              <Title level={4} className="m-0 text-blue-900 flex items-center gap-2">
                <Link href="/">
                  <Image
                  src="/assets/icon-atlas.svg"
                  alt="Next.js logo"
                  width={80}
                  height={38}
                  priority
                  />
                </Link>
              </Title>
            ) : (
              <Link href="/">
                <Image
                  // className="dark:invert"
                  src="/assets/logo-atlas.svg"
                  alt="Next.js logo"
                  width={80}
                  height={38}
                  priority
                />
              </Link>
            )}
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            items={items}
            theme={theme === 'dark' ? 'dark' : 'light'}
            className="border-r-0"
          />
        </Sider>
      )}

      {/* Drawer para mobile */}
      {isMobile && (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setMobileMenuVisible(false)}
          open={mobileMenuVisible}
          styles={{ body: { padding: 0 }, }}
          width={250}
          className={`${theme === 'dark' ? '!bg-[#001529]' : ''}`}
        >
          <div className="p-4 flex items-center justify-center h-16 border-b">
            <Image
              src={'/assets/icon-atlas.svg'}
              alt="Logo"
              width={64}
              height={64}
            />
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            items={items}
            theme={theme === 'dark' ? 'dark' : 'light'}
            className="border-r-0"
          />
        </Drawer>
      )}
    </>
  );
};

export default SideBar;
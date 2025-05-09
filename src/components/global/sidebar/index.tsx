'use client'
import React, { useEffect, useState } from 'react';
import {
  DownCircleOutlined,
  CalendarOutlined,
  LinkOutlined,
  TransactionOutlined,
  WalletOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined, 
  HomeOutlined,
} from '@ant-design/icons';
import { Drawer, Menu } from 'antd';
import type { MenuProps } from 'antd/es/menu';
import { useTheme } from 'next-themes';
import { IMenuItem } from '@/interfaces/global';
import Link from 'next/link';
import Sider from 'antd/es/layout/Sider';
import { useConfiguracao } from '@/providers/configuracao-provider/configuracao-provider';
import Image from 'next/image';
import Title from 'antd/es/typography/Title';
import { useDeviceType } from '@/providers/device-type-provider/device-type-provider';

export type MenuItem = Required<MenuProps>['items'][number];

// Mapeamento de ícones
export const iconMap: Record<string, React.ReactNode> = {
  HomeOutlined: <HomeOutlined />,
  TransactionOutlined: <TransactionOutlined />,
  WalletOutlined: <WalletOutlined />,
  DownCircleOutlined: <DownCircleOutlined />,
};

const SideBar = () => {
  const { isMobile, mobileMenuVisible, setMobileMenuVisible } = useDeviceType();
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<MenuItem[]>([])
  const { theme } = useTheme()
  const { collapsedSidebar, setCollapsedSidebar } = useConfiguracao();
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
      return <Link href={`${path}`}>{label}</Link>;
    }
    return label;
  };


  const mapApiToMenuItem = (apiItem: IMenuItem): MenuItem => {
    const { key, icon, label, children, path } = apiItem;
    return {
      key: `sidebar-${key}`,
      icon: path ? <Link href={`/${path}`}>{icon && iconMap[icon]}</Link> : icon ? iconMap[icon] || null : null,
      label: createLabel(label, path),
      children: children?.map(mapApiToMenuItem),
    } as MenuItem;
  };

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const menuItems: MenuItem[] = [
      {
        key: 'Dashboard',
        icon: iconMap['HomeOutlined'],
        label: createLabel('Dashboard', '/'),
      },
      {
        key: 'deposit',
        icon: iconMap['DownCircleOutlined'],
        label: createLabel('Depósito', '/deposit'),
      },
      {
        key: 'transfer',
        icon: iconMap['TransactionOutlined'],
        label: createLabel('Transferência', '/transfer'),
      },
      {
        key: 'reverse',
        icon: iconMap['WalletOutlined'],
        label: createLabel('Reversão de Operação', '/reverse'),
      },
    ];

    setItems(menuItems);
  }, []);

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
              <Title level={4} className="m-0 text-gray-800 flex items-center gap-2 !transition-all duration-200">
                <Link href="/">
                  <div className="flex flex-row gap-2 leading-5 ">
                    <Image
                      src="/assets/icon-carteira.svg"
                      alt="Next.js logo"
                      width={40}
                      height={38}
                      priority
                    />
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-bold">Carteira</span>
                      <span className="text-gray-800 font-bold">VirtuALL</span>
                    </div>
                  </div>
                </Link>
              </Title>
            ) : (
              <Link href="/">
                <Image
                  src="/assets/icon-carteira.svg"
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
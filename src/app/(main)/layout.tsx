"use client";

import { Header } from "@/components/global/header/header";
import SideBar from "@/components/global/sidebar";
import { useConfiguracao } from "@/providers/configuracao-provider/configuracao-provider";
import { useDeviceType } from "@/providers/device-type-provider/device-type-provider";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { ReactNode, useEffect, useState } from "react";

export default function RoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isMobile } = useDeviceType();
  const { collapsedSidebar } = useConfiguracao();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Layout className="min-h-screen bg-white">
      <Header />
      <SideBar />
      <Content
        style={{
          marginTop: "64px", // Compensa o header fixo
          minHeight: "calc(100vh - 64px)",
          overflow: "auto",
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { ConfigProvider, theme } from "antd";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <AntDesignThemeWrapper>
        {children}
      </AntDesignThemeWrapper>
    </NextThemesProvider>
  );
}

function AntDesignThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme(); 

  return (
    <ConfigProvider
      theme={{
        algorithm: resolvedTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
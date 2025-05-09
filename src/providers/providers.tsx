// providers.tsx
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./theme-provider/theme-provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfiguracaoProvider } from "./configuracao-provider/configuracao-provider";
import { DeviceTypeProvider } from "./device-type-provider/device-type-provider";

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <AntdRegistry>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <ConfiguracaoProvider>
            <DeviceTypeProvider>
              {children}
            </DeviceTypeProvider>
            <Toaster richColors theme="light" /> {/* Considere fazer isso dinâmico */}
        </ConfiguracaoProvider>
      </ThemeProvider>
    </AntdRegistry>
  );
}
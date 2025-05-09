"use client"
import { createContext, useContext, useEffect, useState } from "react";

// Define o tipo do contexto
interface DeviceTypeContextType {
  isMobile: boolean;
  setIsMobile: (items: boolean) => void;
  mobileMenuVisible: boolean;
  setMobileMenuVisible: (items: boolean) => void;
}

// Cria o contexto
const DeviceTypeContext = createContext<DeviceTypeContextType | undefined>(undefined);

// Hook personalizado para usar o contexto de isMobile
export const useDeviceType = () => {
  const context = useContext(DeviceTypeContext);
  if (!context) {
    throw new Error("useDeviceType deve ser usado dentro de um DeviceType");
  }
  return context;
};

// Hook personalizado para gerenciar o estado dos isMobile com localStorage
const useDeviceTypeState = (): DeviceTypeContextType => {
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      // Recupera os isMobile do localStorage ao inicializar
      const savedConfiguracao = localStorage.getItem("isMobile");
      return savedConfiguracao ? savedConfiguracao === "true" : false;
    }
    return false; // Valor padrão se localStorage não estiver disponível
  });

  // Atualiza o localStorage sempre que os isMobile mudam
  useEffect(() => {
    localStorage.setItem("isMobile", isMobile.toString());
  }, [isMobile]);

  // Verificar se é mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, setIsMobile ,mobileMenuVisible, setMobileMenuVisible};
};

// Provider para o contexto de isMobile
export const DeviceTypeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobile, setIsMobile, mobileMenuVisible, setMobileMenuVisible } = useDeviceTypeState();

  return (
    <DeviceTypeContext.Provider value={{ isMobile, setIsMobile, mobileMenuVisible, setMobileMenuVisible }}>
      {children}
    </DeviceTypeContext.Provider>
  );
};
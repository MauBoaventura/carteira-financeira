"use client"
import { createContext, useContext, useEffect, useState } from "react";

interface DeviceTypeContextType {
  isMobile: boolean;
  setIsMobile: (items: boolean) => void;
  mobileMenuVisible: boolean;
  setMobileMenuVisible: (items: boolean) => void;
}

const DeviceTypeContext = createContext<DeviceTypeContextType | undefined>(undefined);

export const useDeviceType = () => {
  const context = useContext(DeviceTypeContext);
  if (!context) {
    throw new Error("useDeviceType deve ser usado dentro de um DeviceType");
  }
  return context;
};

const useDeviceTypeState = (): DeviceTypeContextType => {
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedConfiguracao = localStorage.getItem("isMobile");
      return savedConfiguracao ? savedConfiguracao === "true" : false;
    }
    return false; 
  });

  useEffect(() => {
    localStorage.setItem("isMobile", isMobile.toString());
  }, [isMobile]);

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

export const DeviceTypeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobile, setIsMobile, mobileMenuVisible, setMobileMenuVisible } = useDeviceTypeState();

  return (
    <DeviceTypeContext.Provider value={{ isMobile, setIsMobile, mobileMenuVisible, setMobileMenuVisible }}>
      {children}
    </DeviceTypeContext.Provider>
  );
};
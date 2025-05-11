"use client"
import { createContext, useContext, useEffect, useState } from "react";

interface ConfiguracaoContextType {
  collapsedSidebar: boolean;
  setCollapsedSidebar: (items: boolean) => void;
}

const ConfiguracaoContext = createContext<ConfiguracaoContextType | undefined>(undefined);

export const useConfiguracao = () => {
  const context = useContext(ConfiguracaoContext);
  if (!context) {
    throw new Error("useConfiguracao deve ser usado dentro de um ConfiguracaoProvider");
  }
  return context;
};

const useConfiguracaoState = (): ConfiguracaoContextType => {
  const [collapsedSidebar, setCollapsedSidebar] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedConfiguracao = localStorage.getItem("collapsedSidebar");
      return savedConfiguracao ? savedConfiguracao === "true" : false;
    }
    return false; 
  });

  useEffect(() => {
    localStorage.setItem("collapsedSidebar", collapsedSidebar.toString());
  }, [collapsedSidebar]);

  return { collapsedSidebar, setCollapsedSidebar };
};

export const ConfiguracaoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { collapsedSidebar, setCollapsedSidebar } = useConfiguracaoState();

  return (
    <ConfiguracaoContext.Provider value={{ collapsedSidebar, setCollapsedSidebar }}>
      {children}
    </ConfiguracaoContext.Provider>
  );
};
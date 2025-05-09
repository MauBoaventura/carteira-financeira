"use client";
import { Label } from "@/components/ui/label";
import { Skeleton } from "antd";
import { Switch } from "antd";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ChangeTheme = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const onChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <div className="flex w-full flex-row items-center gap-2">
      <Switch
        aria-label="Switch to Dark Mode"
        className={"data-[state=checked]:bg-green-600"}
        defaultChecked={theme === "dark"}
        onChange={onChange}
      />
      <Label
        htmlFor="airplane-mode"
        className={cn("hidden text-sm", true && "flex")}
      >
        {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
      </Label>
    </div>
  ) : (
    <Skeleton className="h-6 w-full" />
  );
};

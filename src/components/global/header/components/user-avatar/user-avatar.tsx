"use client";
import { useLocation } from "@/hooks";
import { cn } from "@/lib/utils";
import { LogoutOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface UserAvatarProps {
  className?: string;
}
export const UserAvatar: React.FC<UserAvatarProps> = ({ className = "" }) => {
  const { userRole, module } = useLocation();
  const { push } = useRouter();
  const onClick = () => {
    push(`/logout`);
  };
  return (
    <Avatar
      onClick={onClick}
      className={cn(
        "size-[40px] cursor-pointer border-2 border-slate-400",
        className
      )}
    >
      <LogoutOutlined />
    </Avatar>
  );
};

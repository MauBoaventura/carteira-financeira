'use client'
import { Alert, Breadcrumb as BreadcrumbMain, Button } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Breadcrumb from "../breadcrumb";
import { InfoCircleFilled } from "@ant-design/icons";

interface HeaderPageProps {
  title?: string;
  description?: string;
}

export default function HeaderPage({ title, description }: HeaderPageProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-4 p-4">
      {title &&
        <>
          <div className="flex flex-row items-center justify-between" >
            <h1 className="text-lg font-bold text-blue-950">{title}</h1>
            <Button
              type="text"
              icon={<InfoCircleFilled className="!text-blue-600" />}
              onClick={() => setIsAlertVisible(!isAlertVisible)}
              className="text-blue-950 hover:text-blue-700"
            />
          </div>
        </>
      }
      <Breadcrumb />
      {description && isAlertVisible &&
        <div>
          <Alert
            message={description}
            type="info"
            showIcon
            closable
            afterClose={() => setIsAlertVisible(false)}
          />
        </div>
      }
    </div>
  );
}
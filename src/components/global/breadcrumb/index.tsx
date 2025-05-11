'use client'
import { Breadcrumb as BreadcrumbMain } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const routeMap: Record<string, string> = {
    'dashboard': 'Painel',
    'alunos': 'Gerenciar Alunos',
    'professores': 'Gerenciar Professores',
    'favoritos': 'Meus Favoritos',
};

function generateBreadcrumbs(pathname: string) {
    const paths = pathname.split('/').filter(Boolean);

    return paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        return {
            title: routeMap[path] || path.charAt(0).toUpperCase() + path.slice(1),
            href: index < paths.length - 1 ? href : undefined

        };
    });
}

export default function Breadcrumb() {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const breadcrumbItems = generateBreadcrumbs(pathname);
    return (<BreadcrumbMain items={breadcrumbItems} />);
}
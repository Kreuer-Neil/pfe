import {type BreadcrumbItem, IAppHeaderContext} from '@/types';
import { type ReactNode } from 'react';
import CustomAppLayout from "@/layouts/custom-app-layout";

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    appHeaderContext?: IAppHeaderContext | null;
    className?: string;
}

export default ({ children, breadcrumbs, appHeaderContext = null, className, ...props }: AppLayoutProps) => (

    <CustomAppLayout appHeaderContext={appHeaderContext} className={className} {...props}>
        {children}
    </CustomAppLayout>
);

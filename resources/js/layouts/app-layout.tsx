import {type BreadcrumbItem, IAppHeaderContext} from '@/types';
import { type ReactNode } from 'react';
import CustomAppLayout from "@/layouts/custom-app-layout";

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    appHeaderContext?: IAppHeaderContext | null;
}

export default ({ children, breadcrumbs, appHeaderContext = null, ...props }: AppLayoutProps) => (

    <CustomAppLayout appHeaderContext={appHeaderContext} {...props}>
        {children}
    </CustomAppLayout>
);

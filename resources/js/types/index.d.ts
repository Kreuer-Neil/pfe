import {InertiaLinkProps} from '@inertiajs/react';
import {LucideIcon} from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;

    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;

    [key: string]: unknown; // This allows for additional properties...
}

// Custom types
export interface IProject {
    id: bigint;
    name: string;
    icon: string;
    description: string;
    isPrivate: boolean;
}

export interface ITask {
    id: string,
    title: string,
    description: string,
    project_id: string,
    min_participations: bigint,
    starting_at: Date,
    due_at: Date,
    created_at: Date,
    updated_at: Date,

    [key: string]: unknown; // This allows for additional properties...
}

export interface ITaskItem {
    //old
    title: string,
    description: string,
    time: string,
    href: string,
    participations: bigint,
    minParticipations: bigint,
    participating: boolean,
    className?: string,
}

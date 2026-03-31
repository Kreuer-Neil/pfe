import {InertiaLinkProps} from '@inertiajs/react';
import {LucideIcon} from 'lucide-react';

export interface Auth {
    user: IUser;
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


export interface IUser extends IProfile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;

    [key: string]: unknown; // This allows for additional properties...
}

export interface IProfile {
    id: string,
    nickname: string,
    image: string,
    bio: string,

    [key: string]: unknown; // This allows for additional properties...
}

// Custom types
export interface IProject {
    id: number;
    name: string;
    icon: string;
    description: string;
    isPrivate: boolean;

    [key: string]: unknown; // This allows for additional properties...
}

export interface ITask {
    id: string,
    owner: ?IProfile,
    title: string,
    description: string,
    project_id: string,
    min_participations: number,
    // if self is participating
    self_participating: boolean,
    participating_users: IProfile[],
    starting_at: ?string,
    due_at: string ,
    // created_at: string,
    // updated_at: string,
    notes: INote[]|null,

    [key: string]: unknown; // This allows for additional properties...
}

export interface INote {
    id: string,
    owner: IProfile,
    content: string
}

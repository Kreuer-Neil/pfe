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

// Custom types
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

export interface IProfileMiniature {
    id: string;
    first_name: string;
    last_name: string;
    nickname: string;
    pronouns?: string;
    avatar: string;

    [key: string]: unknown; // This allows for additional properties...
}

export interface IProfile {
    id: string;
    first_name: string;
    last_name: string;
    nickname: string;
    pronouns?: string;
    avatar: string;
    bio?: string;
    is_following?: boolean;

    [key: string]: unknown; // This allows for additional properties...
}

export interface IProjectContext {
    name: string;
    icon: string;
    slug: string;

    [key: string]: unknown;
}

export interface IDashboardProject extends IProjectContext {
    description: string;
    members_count: number;
    coordinates: string;
    place: string | null;

    slug: string;
    // featured_members: IUser[];
}

export interface IProjectMiniature extends IProjectContext {
    description: string;
    // featured_members: IUser[];
    user_role: 'viewer' | 'member' | 'taskmaster' | 'moderator' | 'admin';
    is_member: boolean;
    members_count: number;
    coordinates: string | null;
    place: string | null;
    tags: Array<string>;

    slug: string;
}

export interface IProjectShow extends IProjectMiniature {

    // is_private: boolean;
    user_role: 'viewer';
    members: IProfile[];
}

export interface IProject extends IProjectShow {
    name: string;
    icon: string;
    description: string;
    is_private: boolean;
    owner: IUser;
    members: IUser[];
    members_count: number;

    coordinates: string | null;
    place: string | null;
    tags: Array<string>;

    user_role: 'member' | 'task_manager' | 'moderator' | 'admin' | 'banned';

    upcoming_tasks: ITask[];
}

export interface ITask {
    id: string;
    owner: ?IProfile;
    title: string;
    description: string;
    project: IProjectContext;
    min_participations: ?number;
    participations_count: number;
    related_users: IProfile[];
    // if self is participating
    self_participating: boolean;
    participating_users: IProfile[];
    starting_at: ?string;
    due_at: string;
    // created_at: string;
    // updated_at: string;
    // created_at: string;
    is_owner: boolean;
    validated: boolean;
    notes: INote[] | null;

    [key: string]: unknown;
}

export interface INote {
    id: string;
    owner: IProfile;
    content: string;

    [key: string]: unknown;
}

// Non-items related items
export interface IAppHeaderContext {
    contextImageSrc?: string;
    contextImageAlt?: string;
    context?: string;
    contextSecondary?: string | null;
}

interface IPaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface IServerResponse {
    success: boolean;
    error: ITranslatableObject | null;
}

export interface ITranslatableObject {
    key: string;
    params: { [key: string]: string };
}

export interface INavUser extends IProfile {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
    created_at: string;
    updated_at: string;

    projects: IProjectContext[];

    [key: string]: unknown;
}

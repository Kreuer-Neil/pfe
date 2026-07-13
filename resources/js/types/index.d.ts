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

export interface IMember extends IProfile {
    role: 'member' | 'taskmaster' | 'moderator' | 'admin';
}

export interface ILocation {
    id: number;
    latitude: string;
    longitude: string;
    display_name: string;
    name: string;
    osm_id: string;
    osm_type: string;
    type: string;
}

// Raw Nominatim search result, as proxied by LocationController::search().
// Not the same shape as ILocation - this hasn't been resolved/persisted yet.
export interface INominatimResult {
    osm_id: number;
    osm_type: string;
    display_name: string;
    type: string;
}

// Response shape of LocationController::search() - `query` is the resolved search
// text (typed verbatim in free mode, built server-side from fields in precise mode),
// and must be stored alongside the chosen result so resolveFromSearchCache() can find it again.
export interface INominatimSearchResponse {
    query: string;
    results: INominatimResult[];
}

export interface IUserPreferences {
    languages: string[];
    tags: string[];
    place: string | null;
}

export interface IProjectContext {
    name: string;
    icon: string;
    slug: string;
    user_role: 'viewer' | 'member' | 'taskmaster' | 'moderator' | 'admin';

    [key: string]: unknown;
}

export interface IDashboardProject extends IProjectContext {
    description: string;
    members_count: number;
    location: ILocation | null;
    place: string | null;
    distance: number | null;

    slug: string;
    // featured_members: IUser[];
}

export interface IProjectMiniature extends IProjectContext {
    description: string;
    // featured_members: IUser[];
    // TODO fix with clean ProjectRole type/enum later.
    is_member: boolean;
    members_count: number;
    location: ILocation | null;
    place: string | null;
    distance: number | null;
    tags: Array<string>;

    slug: string;
}

export interface IProjectShow extends IProjectMiniature {

    // is_private: boolean;
    // user_role: 'viewer';
    members: IProfile[];
}

export interface IProject extends IProjectShow {
    name: string;
    icon: string;
    description: string;
    is_private: boolean;
    owner: IUser;
    members: IMember[];
    members_count: number;

    location: ILocation | null;
    place: string | null;
    tags: Array<string>;

    // user_role: 'member' | 'task_manager' | 'moderator' | 'admin' | 'banned';

    upcoming_tasks: ITask[];
}

// Raw invitation row, as shaped by ProjectInvitationResource - only ever delivered inside
// IProjectSettings (settings page), gated to admins/moderators server-side.
export interface IProjectInvitation {
    id: number;
    code: string;
    max_uses: number | null;
    used_count: number;
    remaining_uses: number | null;
    is_valid: boolean;
    expires_at: string | null;
    created_at: string;
}

// Shape delivered by ProjectSettingsResource (ProjectController::edit() only) - IProject plus
// settings-only fields. Don't add these fields to IProject itself; other pages using IProject
// (e.g. projects-show.tsx) never receive them.
export interface IProjectSettings extends IProject {
    invitations: IProjectInvitation[];
}

export interface ITask {
    id: string;
    owner: IProfile | null;
    title: string;
    description: string;
    project: IProjectContext;
    min_participations: number | null;
    participations_count: number;
    related_users: IProfile[];
    // if self is participating
    self_participating: boolean;
    participating_users: IProfile[];
    starting_at: string | null;
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
    is_owner:boolean;

    [key: string]: unknown;
}

export interface IChatRoom {
    id: string;
    name: string | null;
}

export interface IChatMessageReplyPreview {
    id: string;
    content: string;
    owner: IProfile | null;
}

export interface IChatMessage {
    id: string;
    content: string;
    owner: IProfile | null;
    is_owner: boolean;
    reply_to: IChatMessageReplyPreview | null;
    edited: boolean;
    created_at: string;
    updated_at: string;

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

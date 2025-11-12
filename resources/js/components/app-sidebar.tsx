import {NavFooter} from '@/components/nav-footer';
import {NavMain} from '@/components/nav-main';
import {NavUser} from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {dashboard} from '@/routes';
import {type NavItem, type SharedData} from '@/types';
import {Link, usePage} from '@inertiajs/react';
import {BookOpen, Folder, LayoutGrid} from 'lucide-react';
import AppLogo from './app-logo';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Projects',
        href: '/projects',
        icon: BookOpen,
    }
];
// const { auth } = usePage<SharedData>().props;

// TODO access Auth::user()->projects to insert here
// https://ui.shadcn.com/docs/components/sidebar#sidebargroup
// let projectNavItems:NavItem[] = [];
//
// for (const project of auth.user.projects) {
//     projectNavItems.push({
//         title: project.name,
//         href: 'projects/' + project.id,
//         icon: BookmarkIcon,
//     });
// }


const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const {auth} = usePage<SharedData>().props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo/>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/*<SidebarContent>
                <NavMain items={mainNavItems}/>
            </SidebarContent>*/}

            <SidebarContent>
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Come Unite</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem key={"projects"}>
                            <SidebarMenuButton
                                asChild
                                isActive={false}
                            >
                                <Link href={"/projects"} prefetch>
                                    <BookOpen/>
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem key={"pashboard"}>
                            <SidebarMenuButton
                                asChild
                                isActive={false}
                            >
                                <Link href={"/dashboard"} prefetch>
                                    <BookOpen/>
                                    <span>My projects</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {/*<Collapsible defaultOpen className="group/collapsible">
                            <SidebarMenuItem key={"my-projects"}>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                        <BookOpen />
                                        <span>My projects</span>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton>
                                            <Link href={"/project"}>
                                                <span>
                                                    Single Project
                                                </span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>

                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>*/}




                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>My projects</SidebarGroupLabel>
                    <SidebarMenu>
                        {/*map projects*/}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>


            {<SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto"/>
                <NavUser/>
            </SidebarFooter>}
        </Sidebar>
    );
}

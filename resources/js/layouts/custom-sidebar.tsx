import {ReactNode} from "react";
import {useTranslation} from "react-i18next";
import {ChartGantt, HashIcon, Home, LucideIcon, Search, Settings2} from "lucide-react";
import ProjectIcon from "@/components/icons/project-icon";
import {dashboard} from "@/routes";
import {Link, usePage} from "@inertiajs/react";
import {IProjectContext, type SharedData} from "@/types";
import {useImageAsset} from "@/hooks/use-image-asset";
import {show as projectsShow} from "@/routes/projects";
import {index as projectsIndex, myProjects} from "@/actions/App/Http/Controllers/ProjectController";
import {show as showProfile} from "@/actions/App/Http/Controllers/UserProfileController";
import {index as feedIndex} from "@/actions/App/Http/Controllers/FeedController";
import {cn} from "@/lib/utils";
import {index} from "@/actions/App/Http/Controllers/Settings/ProfileController";
import NotificationBell from "@/components/notifications/notification-bell";
import {Badge} from "@/components/ui/badge";

interface INavItemProps {
    icon?: LucideIcon;
    title: string;
    href: string;
    project?: IProjectContext;
    badge?: boolean;
}

function SidebarNavItem({props, className = ''}: { props: INavItemProps, className?: string; }) {
    const Icon = props.icon;
    return (
        <li>
            <Link href={props.href}
                  className={cn('nav-item', className)}>
                {Icon ?
                    <Icon className="p-1"/>
                    : props.project
                    && <ProjectIcon project={props.project} className="border border-secondary-border"/>
                }
                {props.badge &&
                    <Badge variant="destructive" className="nav-active w-2 p-0"/>
                }
                <span className="nav-item-title">{props.title}</span>
            </Link>
        </li>
    );
}

export default function CustomSidebar(
    {switchModalState, sidebarSwitchIcon: SidebarSwitchIcon}: {
        switchModalState: () => void,
        sidebarSwitchIcon: LucideIcon,
    }): ReactNode {
    const {t} = useTranslation('common');

    const {auth, hasUnreadFeedItems} = usePage<SharedData>().props;

    const navItems: INavItemProps[] = [
        {
            icon: Home,
            title: t('dashboard'),
            href: dashboard().url
        },
        {
            icon: HashIcon,
            title: t('feed'),
            href: feedIndex().url,
            badge: hasUnreadFeedItems,
        },
        /*{
            icon: Calendar,
            title: t('my_tasks'),
            href: tasksIndex().url
        },*/
        {
            icon: Settings2,
            title: t('settings'),
            href: index().url
        },
        {
            icon: ChartGantt,
            title: t('manage_projects'),
            href: myProjects().url
        },
    ];

    // TODO change auth.user declaration
    const projects: IProjectContext[] = auth.user.projects as IProjectContext[];

    const searchNavItem: INavItemProps = {
        title: t('search_project'),
        icon: Search,
        href: projectsIndex().url
    };

    return (
        <nav className="sidebar" id="sidebar">
            <h2 className="sr-only">{t('nav_title')}</h2>

            <SidebarSwitchIcon className="p-2 mt-4 mr-4 ml-auto cursor-pointer" onClick={switchModalState}
                               onKeyDown={(e) => {
                                   if (e.key === 'Enter') switchModalState();
                               }} tabIndex={0} id="sidebar-switch"/>

            <div className="sidebar-content">

                <div>
                    <Link as="a" href={showProfile(auth.user.uuid).url}
                          className="nav-profile">
                        {/* TODO replace with userIcon fn please */}
                        <img src={useImageAsset(`users/${auth.user.avatar}/small`)}
                             srcSet={
                            useImageAsset(`users/${auth.user.avatar}/small`) + ' 1x, '+
                            useImageAsset(`users/${auth.user.avatar}/medium`) + ' 2x, ' +
                            useImageAsset(`users/${auth.user.avatar}/large`) + ' 3x, '
                        }
                             alt={t('user_profile_picture', {user: auth.user.nickname})}
                             className="nav-pfp"/>
                        <span className="nav-title">{auth.user.nickname}</span>
                    </Link>
                    <ul className="nav-item-container">
                        <SidebarNavItem props={navItems[0]} key={0}/>
                        <li>
                            <NotificationBell variant="nav-item"/>
                        </li>
                        {
                            navItems.slice(1).map((navItem, i) => {
                                return (
                                    <SidebarNavItem props={navItem} key={i + 1}/>
                                )
                            })
                        }
                    </ul>
                </div>
                <div>
                    <div className="nav-closed-separator"/>
                    <span className="nav-title flex items-center py-2 px-2">
                        {t('my_projects')}
                    </span>
                    <ul className="nav-item-container">
                        {projects.length > 0 ?
                            projects.map((project: IProjectContext, i) => {
                                const navItem: INavItemProps = {
                                    title: project.name,
                                    href: projectsShow(project.slug).url,
                                    project: project,
                                }
                                return (
                                    <SidebarNavItem props={navItem} key={i}/>
                                );
                            }) :
                            <li><p className="pl-2">
                                {t('projects_not_found')}
                            </p></li>
                        }
                        <SidebarNavItem props={searchNavItem} className="mt-4"/>
                    </ul>
                </div>

            </div>
        </nav>
    );
}

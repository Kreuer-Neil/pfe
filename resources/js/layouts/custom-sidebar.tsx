import {ReactNode} from "react";
import {useTranslation} from "react-i18next";
import {Bell, Calendar, ChartGantt, Home, LucideIcon, Search, Settings2} from "lucide-react";
import ProjectIcon from "@/components/icons/project-icon";
import {dashboard} from "@/routes";
import {index as tasksIndex} from "@/actions/App/Http/Controllers/TaskController";
import {Link, usePage} from "@inertiajs/react";
import {IProjectContext, type SharedData} from "@/types";
import {useImageAsset} from "@/hooks/use-image-asset";
import {show as projectsShow} from "@/routes/projects";
import {index as projectsIndex, myProjects} from "@/actions/App/Http/Controllers/ProjectController";
import {show as showProfile} from "@/actions/App/Http/Controllers/UserProfileController";
import {cn} from "@/lib/utils";
import {edit as profileEdit} from "@/actions/App/Http/Controllers/Settings/ProfileController";

interface INavItemProps {
    icon?: LucideIcon;
    title: string;
    href: string;
    project?: IProjectContext;
}

function SidebarNavItem({props, className = ''}: { props: INavItemProps, className?: string; }) {
    const Icon = props.icon;
    return (
        <li>
            <Link as="a" href={props.href}
                  className={cn('nav-item section-title', className)}>
                {Icon ?
                    <Icon className="p-1"/>
                    /* @ts-ignore */
                    : props.project
                    && <ProjectIcon project={props.project} className="border border-secondary-border"/>
                }
                <span>{props.title}</span>
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

    const {auth} = usePage<SharedData>().props;

    const navItems: INavItemProps[] = [
        {
            icon: Home,
            title: t('dashboard'),
            href: dashboard().url
        },
        /*{
            icon: Bell,
            title: t('notifications'),
            href: ''
        },*/
        /*{
            icon: Calendar,
            title: t('my_tasks'),
            href: tasksIndex().url
        },*/
        {
            icon: Settings2,
            title: t('settings'),
            href: profileEdit().url
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
                                   if (e.key === 'Enter' || e.key === ' ') switchModalState();
                               }} tabIndex={0} id="sidebar-switch"/>

            <div className="sidebar-content">

                <div>
                    <Link as="a" href={showProfile(auth.user.id).url}
                          className="nav-profile">
                        {/* TODO replace with userIcon fn please */}
                        <img src={useImageAsset(`users/${auth.user.avatar}/small`)}
                             srcSet={
                            useImageAsset(`users/${auth.user.avatar}/small`) + ' 1x, '+
                            useImageAsset(`users/${auth.user.avatar}/medium`) + ' 2x, ' +
                            useImageAsset(`users/${auth.user.avatar}/large`) + ' 3x, '
                        }
                             alt={t('user_profile_picture', {username: auth.user.nickname})}
                             className="nav-pfp"/>
                        <span className="page-title">{auth.user.nickname}</span>
                    </Link>
                    <ul className="nav-item-container">
                        {
                            navItems.map((navItem, i) => {
                                return (
                                    <SidebarNavItem props={navItem} key={i}/>
                                )
                            })
                        }
                    </ul>
                </div>
                <div>
                    <div className="nav-closed-separator"/>
                    <span className="page-title flex items-center min-h-16 px-2">
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

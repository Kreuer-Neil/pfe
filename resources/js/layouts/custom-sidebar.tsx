import {ReactNode} from "react";
import {useTranslation} from "react-i18next";
import {Bell, Calendar, Home, LucideIcon, Search, Settings2} from "lucide-react";
import ProjectIcon from "@/components/icons/project-icon";
import {dashboard} from "@/routes";
import {index as tasksIndex} from "@/actions/App/Http/Controllers/TaskController";
import {Link, usePage} from "@inertiajs/react";
import {IProjectContext, type SharedData} from "@/types";
import {useImageAsset} from "@/hooks/use-image-asset";
import {show as projectsShow} from "@/routes/projects";
import ButtonText from "@/components/buttons/button-text";
import {index as projectsIndex} from "@/actions/App/Http/Controllers/ProjectController";

interface INavItemProps {
    icon?: LucideIcon;
    title: string;
    href: string;
    project?: IProjectContext,
}

function SidebarNavItem({props}: { props: INavItemProps }) {
    const Icon = props.icon;
    return (
        <Link as="li" href={props.href}
              className="p-2 flex gap-2 items-center section-title cursor-pointer hover:bg-secondary rounded-sm">
            {Icon ?
                <Icon className="p-1"/>
                /* @ts-ignore */
                : props.project
                    ? <ProjectIcon project={props.project} className="border border-secondary-border"/>
                    : null}
            {props.title}
        </Link>
    );
}

export default function CustomSidebar(): ReactNode {
    const {t} = useTranslation('common');

    const {auth} = usePage<SharedData>().props;

    const navItems: INavItemProps[] = [
        {
            icon: Home,
            title: t('dashboard'),
            href: dashboard().url
        },
        {
            icon: Bell,
            title: t('notifications'),
            href: ''
        },
        {
            icon: Calendar,
            title: t('my_tasks'),
            href: tasksIndex().url
        },
        {
            icon: Settings2,
            title: t('settings'),
            href: ''
        }
    ]

    // TODO change auth.user declaration
    const projects: IProjectContext[] = auth.user.projects as IProjectContext[];

    const searchNavItem: INavItemProps = {
        title: t('search_project'),
        icon: Search,
        href: projectsIndex().url,
    };

    return (
        <nav
            className="h-screen overflow-y-scroll bg-sidebar w-2xs max-w-[85vw] max-sm:absolute max-sm:left-0 max-sm:top-0">
            <h2 className="sr-only">{t('title')}</h2>
            <div className="p-2 py-12 flex flex-col gap-8">

                <div>
                    <span className="page-title flex gap-3 p-2">
                        <img src={useImageAsset(`users/${'user_slug'}/small`)}
                             alt={t('user_profile_picture', {username: 'username'})}
                             className="bg-loading rounded-full size-12 border border-secondary-border"/>
                        {'username'}
                    </span>
                    <ul className="flex flex-col pl-0.5 ml-8 mr-4 border-l-2 border-secondary-border">
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
                    <span className="page-title flex items-center min-h-16 px-2">
                        {t('my_projects')}
                    </span>
                    <ul className="flex flex-col pl-0.5 ml-8 mr-4 border-l-2 border-secondary-border">
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
                        <SidebarNavItem props={searchNavItem}/>
                    </ul>
                </div>

            </div>
        </nav>
    );
}

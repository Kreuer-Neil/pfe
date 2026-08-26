import AppLayout from '@/layouts/app-layout';
import {dashboard} from '@/routes';
import {type BreadcrumbItem, IDashboardFeedItem, IDashboardProject, IProjectMiniature, ITask} from '@/types';
import {Head, usePage} from '@inertiajs/react';
import MyProjects from "@/components/dashboard/my-projects";
import ProjectsSection from "@/components/dashboard/projects-section";
import FeedSection from "@/components/dashboard/feed-section";
import TaskDisplay from "@/components/tasks/task-display";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import ConfirmModal from "@/components/modals/confirm-modal";
import UserPreferencesController from "@/actions/App/Http/Controllers/UserPreferencesController";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];


type PageProps = {
    projects: IDashboardProject[],
    suggestedProjects: IProjectMiniature[],
    tasks: ITask[],
    feedItems: IDashboardFeedItem[],
    dashboardFeedHidden: boolean,
};
export default function Dashboard() {
    const {projects, suggestedProjects, tasks, feedItems, dashboardFeedHidden} = usePage<PageProps>().props;
    const {t} = useTranslation('dashboard');

    const [feedHidden, setFeedHidden] = useState(dashboardFeedHidden);
    const [showDismissModal, setShowDismissModal] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard"/>
            <h1 className="sr-only">{t('title')}</h1>
            {/* TODO if first connection (passed from the onboarding->with()), use simple welcome text? */}
            {!feedHidden &&
                <FeedSection items={feedItems} onDismiss={() => setShowDismissModal(true)}/>
            }

            {/*Tasks section*/}
            <TaskDisplay tasks={tasks} isInProjectPage={false}
                         title={t('upcoming_tasks')}
            />
            {/* TODO setup absence feature (do not disturb-like)
                <Button as={"a"} textContent={t('project.get_absent')} type="warning" className="-mt-4"/>*/}

            <MyProjects projects={projects}/>
            <ProjectsSection title={t('suggested_projects')} projects={suggestedProjects}/>

            {/*<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 ">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
                    {t('notifications')}
                </div>
            </div>*/}

            <ConfirmModal
                id="news-dismiss-confirm"
                showModal={showDismissModal}
                onClose={() => setShowDismissModal(false)}
                onSuccess={() => {
                    setFeedHidden(true);
                    setShowDismissModal(false);
                }}
                formAction={UserPreferencesController.updateDashboardFeedVisibility.form()}
                fields={{dashboard_feed_hidden: '1'}}
                title={t('news_dismiss_title')}
                message={t('news_dismiss_message')}
            />
        </AppLayout>
    );
}

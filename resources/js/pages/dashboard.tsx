import AppLayout from '@/layouts/app-layout';
import {dashboard} from '@/routes';
import {type BreadcrumbItem, IDashboardProject, ITaskMiniature, SharedData} from '@/types';
import {Head, usePage} from '@inertiajs/react';
import MyProjects from "@/components/dashboard/my-projects";
import TaskDisplay from "@/components/tasks/task-display";
import PageFlowContainer from "@/components/page-flow-container";
import {useTranslation} from "react-i18next";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];


type PageProps = {
    userProjects: IDashboardProject[],
    tasks: ITaskMiniature[],
};
export default function Dashboard() {
    const {userProjects, tasks} = usePage<PageProps>().props;
    const {auth} = usePage<SharedData>().props;
    const currentUser = auth.user;
    const {t} = useTranslation('dashboard');

    // currentUser.nickname = currentUser.nickname ?? `${currentUser.firstName} ${currentUser.lastName}`;

    // Task modal values

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard"/>
            <h1 className="sr-only">{t('title')}</h1>
            <PageFlowContainer>
                {/* TODO if first connection, use simple welcome text? */}
                <section className="items-section hidden">
                    <div className="mx-3">
                        <h2 className="page-title">{t('welcome_back') + currentUser.nickname}</h2>
                        <p className="section-title">{t('news')}</p>
                    </div>
                    <div>
                        {/*scrollable news*/}
                    </div>
                </section>

                {/*Tasks section*/}
                <TaskDisplay tasks={tasks} isInProjectPage={false}
                             title={t('upcoming_tasks')}
                />
                {/* TODO setup absence feature (do not disturb-like)
                <Button as={"a"} textContent={t('project.get_absent')} type="warning" className="-mt-4"/>*/}

                <MyProjects projects={userProjects}/>


                {/*<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 ">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
                    {t('notifications')}
                </div>
            </div>*/}
            </PageFlowContainer>
        </AppLayout>
    );
}

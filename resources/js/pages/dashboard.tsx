import AppLayout from '@/layouts/app-layout';
import {dashboard} from '@/routes';
import {type BreadcrumbItem, IDashboardProject, ITask, SharedData} from '@/types';
import {Head, usePage} from '@inertiajs/react';
import {useLang} from "@/hooks/useLang";
import MyProjects from "@/components/dashboard/my-projects";
import TaskDisplay from "@/components/tasks/task-display";
import PageFlowContainer from "@/components/page-flow-container";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];


type PageProps = {
    userProjects: IDashboardProject[],
    tasks: ITask[],
};
export default function Dashboard() {
    const {userProjects, tasks} = usePage<PageProps>().props;
    const {auth} = usePage<SharedData>().props;
    const currentUser = auth.user;
    const {__, trans} = useLang();

    currentUser.nickname = currentUser.nickname ?? `${currentUser.firstName} ${currentUser.lastName}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard"/>
            <PageFlowContainer>
                {/* TODO if first connection, use simple welcome text? */}
                <section className="items-section hidden">
                    <div className="mx-3">
                    <h2 className="page-title">{trans('dashboard.welcome_back', {name: currentUser.nickname})}</h2>
                    <p className="section-title">{__('dashboard.news')}</p>
                    </div>
                    <div>
                        {/*scrollable news*/}
                    </div>
                </section>

                {/*Tasks section*/}
                <TaskDisplay level={2} tasks={tasks} isInProjectPage={false}/>
                {/* TODO setup absence feature (do not disturb-like)
                <Button as={"a"} textContent={__('project.get_absent')} type="warning" className="-mt-4"/>*/}

                <MyProjects projects={userProjects}/>


                {/*<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 ">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
                    {__('dashboard.notifications')}
                </div>
            </div>*/}
            </PageFlowContainer>
        </AppLayout>
    );
}

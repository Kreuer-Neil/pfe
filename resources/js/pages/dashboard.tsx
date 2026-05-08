import AppLayout from '@/layouts/app-layout';
import {dashboard} from '@/routes';
import {type BreadcrumbItem, IDashboardProject, ITask, SharedData} from '@/types';
import {Head, usePage} from '@inertiajs/react';
import {useLang} from "@/hooks/useLang";
import MyProjects from "@/components/dashboard/my-projects";
import TaskDisplay from "@/components/tasks/task-display";
import PageFlowContainer from "@/components/page-flow-container";
import i18n from "i18next";
import {initReactI18next, useTranslation} from "react-i18next";

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources: {
            en: {
                translation: {
                    "dashboard.title": "Dashboard",
                    'dashboard.welcome_back': 'Welcome back ',
                    'dashboard.news': 'Here\'s what you missed',
                }
            }
        },
        lng: "en", // if you're using a language detector, do not define the lng option
        fallbackLng: "en",

        interpolation: {
            escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        }
    });


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
    const { t } = useTranslation();

    currentUser.nickname = currentUser.nickname ?? `${currentUser.firstName} ${currentUser.lastName}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard"/>
            <h1 className="sr-only">{t('dashboard.title')}</h1>
            <PageFlowContainer>
                {/* TODO if first connection, use simple welcome text? */}
                <section className="items-section hidden">
                    <div className="mx-3">
                    <h2 className="page-title">{t('dashboard.welcome_back') + currentUser.nickname}</h2>
                    <p className="section-title">{t('dashboard.news')}</p>
                    </div>
                    <div>
                        {/*scrollable news*/}
                    </div>
                </section>

                {/*Tasks section*/}
                <TaskDisplay level={2} tasks={tasks} isInProjectPage={false} title={t('dashboard.upcoming_tasks')}/>
                {/* TODO setup absence feature (do not disturb-like)
                <Button as={"a"} textContent={t('project.get_absent')} type="warning" className="-mt-4"/>*/}

                <MyProjects projects={userProjects}/>


                {/*<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 ">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
                    {t('dashboard.notifications')}
                </div>
            </div>*/}
            </PageFlowContainer>
        </AppLayout>
    );
}

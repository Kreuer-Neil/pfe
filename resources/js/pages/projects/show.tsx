import {type BreadcrumbItem, IProject, IProjectShow} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Head, usePage} from "@inertiajs/react";
import PageFlowContainer from "@/components/page-flow-container";
import {useLang} from "@/hooks/useLang";
import TaskDisplay from "@/components/tasks/task-display";
import Layout from "@/layouts/app-layout";
import {ReactNode} from "react";
import {instanceOfProject, instanceOfProjectShow} from "@/helpers/type-check";

type pageProps = {
    project: IProject | IProjectShow | null,
}

type visitorPageProps = {
    project: IProjectShow,
}

type memberPageProps = {
    project: IProject,
}

function Page404(): ReactNode {
    return (
        <Layout>
            <Head title="404"/>
            <h1 className="page-title text-center">
                404: Project not found
            </h1>
        </Layout>
    );
}


/**
 * Page display for non-members.
 */
function VisitorPage() {
    const {project} = usePage<visitorPageProps>().props;
    const {route} = usePage<{ route: string }>().props;
    const {__} = useLang();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: project.name,
            href: route,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name}/>
            <h1>{project.name}</h1>
            <PageFlowContainer className="pt-0">
                <header>
                    <article>

                    </article>
                </header>

                <section>
                </section>

            </PageFlowContainer>

        </AppLayout>
    );
}


/**
 * Page display for members only.
 */
function MemberPage() {
    const {project} = usePage<memberPageProps>().props;
    const {route} = usePage<{ route: string }>().props;
    const {__} = useLang();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: project.name,
            href: route,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name}/>
            <PageFlowContainer className="pt-0">
                <header>
                    <h1 className="page-title">{project.name}</h1>
                    <article>

                    </article>
                </header>

                <TaskDisplay tasks={project.upcoming_tasks} title={__('project.upcoming_tasks')}/>
            </PageFlowContainer>

        </AppLayout>
    );
}

export default function ProjectShow() {
    const {project} = usePage<pageProps>().props;

    if (!project) {
        return <Page404/>;
    } else if (instanceOfProjectShow(project)) {
        return <VisitorPage/>;
        //
    } else if (instanceOfProject(project)) {
        return <MemberPage/>
    }
    return <Page404/>;
}

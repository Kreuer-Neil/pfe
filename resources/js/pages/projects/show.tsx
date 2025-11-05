import type {BreadcrumbItem, IProject} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Head, usePage} from "@inertiajs/react";


export default function ProjectShow() {
    const {project} = usePage<{ project: IProject }>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: project.name,
            href: 'projects/' + project.id,
        },
    ];


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name}>

            </Head>
        </AppLayout>
    );
}

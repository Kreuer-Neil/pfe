import type {BreadcrumbItem, IProject} from "@/types";
import {dashboard} from "@/routes";
import AppLayout from "@/layouts/app-layout";
import {usePage} from "@inertiajs/react";

/*const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: showProject().url,
    },
];*/

export default function ProjectIndex() {

    const {projects} = usePage<{ projects: IProject[] }>().props;
    return (
        <AppLayout>

            <div>
                <ul>
                    {projects.map((project) => (
                            <li key={project.id}>
                                {project.name}
                            </li>
                        )
                    )

                    }
                </ul>
                <p>Hello</p>
            </div>
        </AppLayout>
    );
}

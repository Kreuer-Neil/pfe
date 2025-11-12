import type {BreadcrumbItem} from "@/types";
import {dashboard} from "@/routes";
import AppLayout from "@/layouts/app-layout";
import {usePage} from "@inertiajs/react";

/*const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: showProject().url,
    },
];*/

interface IProject {
    id: bigint;
    name: string;
}

export default function ProjectTable() {

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

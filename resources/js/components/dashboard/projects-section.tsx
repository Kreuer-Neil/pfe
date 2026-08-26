import {IDashboardProject, IProjectMiniature} from "@/types";
import {ReactNode} from "react";
import ProjectItem from "@/components/projects/project-item";

interface ProjectsSectionProps {
    title: string;
    projects: (IDashboardProject | IProjectMiniature)[];
    action?: ReactNode;
    emptyState?: ReactNode;
}

export default function ProjectsSection({title, projects, action, emptyState}: ProjectsSectionProps): ReactNode {
    if (projects.length <= 0 && !emptyState)
        return null;

    return (
        <section className="items-section max-w-xl w-full">
            <div className="flex flex-wrap items-center mx-3 mb-1">
                <h2 className="section-title w-fit mr-auto">
                    {title}
                </h2>
                {action}
            </div>
            {projects.length <= 0 ? (
                <div className="thumbnails-list-container">
                    {emptyState}
                </div>
            ) : (
                <ol className="thumbnails-list-container">
                    {projects.map((project): ReactNode => (
                        <li key={project.slug} className="w-full">
                            <ProjectItem project={project}/>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
}
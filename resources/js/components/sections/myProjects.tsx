import {useLang} from "@/hooks/useLang";
import {IProject} from "@/types";
import {ReactNode} from "react";
import {Link} from "@inertiajs/react";

function ProjectItems({projects}: { projects: IProject[] }): ReactNode {
    const {__} = useLang()
    if (projects.length > 0) {
        return (
            <div className={"my-projects__container"}>
                {
                    projects.map((project: IProject): ReactNode => {
                        return <article>
                            <h3>{project.name}</h3>
                            <div>

                            </div>
                            {/*TODO fix route and put slug instead of ID later*/}
                            <Link className={"cta-button"}
                                href={"projects/" + project.id}>{__("project.see_project")}</Link>
                        </article>
                    })
                }
            </div>
        );
    }
    // Else
    return (
        <div className={"empty-warning"}>
            <p>{__("project.no_projects_joined")}</p>
            {/*TODO fix route*/}
            <Link className={"cta-button"}
                href={"projects/search"}>{__("project.search_project")}</Link>
        </div>
    );
}

export default function MyProjects({projects}: { projects: IProject[] }): ReactNode {
    const {__} = useLang()
    return (
        <section className={"section"}>
            <h2 className={"section__title"}>
                {__('nav.my_projects')}
            </h2>
            <ProjectItems projects={projects}/>
        </section>
    );
}

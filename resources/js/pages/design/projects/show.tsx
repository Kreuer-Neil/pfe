import type {BreadcrumbItem} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Head} from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My projects',
        href: 'design/projects'
    },
    {
        title: 'Building 22b garden',
        href: 'design/projects/project',
    },
];

const links = {
    agenda: "design/projects/project/agenda",
}

export default function ProjectShow() {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title}/>

            <div className={"@container w-full max-w-7xl p-4 flex flex-col items-center gap-3"}>

                <section className={"widget h-fit"}>
                    <h2 className={"widget-head"}>My next tasks</h2>
                    <ul className={"widget-container"}>

                        <li>
                            <a href="#" className={"cursor-default"}>
                                <article className={"widget-item"}>
                                    <h3 className={"self-center text-xl font-bold"}>Water the plants</h3>
                                    <p>The plants in our appartment’s shared garden need constant watering and
                                        care, especially if it didn’t rain.</p>
                                    <time className={"text-gray-400 text-xs self-end pr-2"}>
                                        Monday 16/07, 13:00 - 19:00
                                    </time>
                                </article>
                            </a>
                        </li>

                        <li>
                            <a href="#" className={"cursor-default"}>
                                <article className={"widget-item"}>
                                    <h3 className={"self-center text-xl font-bold"}>Start compost</h3>
                                    <p>We're out of compost, and the bin is full, so it would be great if
                                        someone
                                        prepared some new one! Don't forget: Just put the bio garbage inside the
                                        bin
                                        and press the red button! Not the black one!</p>
                                    <time className={"text-gray-400 text-xs self-end pr-2"}>Monday 16/07 -
                                        Friday
                                        21/07
                                    </time>
                                </article>
                            </a>
                        </li>

                    </ul>
                    <div className={"widget-openlink-container"}>
                        <a href={links.agenda}
                           className={"widget-openlink"}>Show my agenda</a>
                    </div>
                </section>
            </div>


        </AppLayout>
    );
}

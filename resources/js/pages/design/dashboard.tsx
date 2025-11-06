import AppLayout from "@/layouts/app-layout";
import {Head} from "@inertiajs/react";
import type {BreadcrumbItem} from "@/types";
import {dashboard} from "@/routes";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const links = {
    agenda: "/design/agenda",
    notifications: '/design/notifications'
};

export default function DesignDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard"/>
            {/*<div className={"w-full p-4 grid grid-flow-row-dense row-auto md:grid-cols-3 lg:grid-cols-4 gap-3"}>*/}
            <div className="@container w-full max-w-7xl p-4">
                <div className={"grid @3xl:grid-flow-col gap-4 @3xl:grid-cols-[auto_20rem]"}>

                    <aside className={"widget sticky justify-self-center @3xl:order-1"}>
                        <h2 className={"peer"}>
                            <label htmlFor="notifications-close" className={"widget-head bg-notifications relative"
                                /*+ "has-checked:rounded-b-xl"*/}>

                            Notifications <input id={"notifications-close"} type={"checkbox"} /*defaultChecked={true}*/ className={"@3xl:hidden absolute right-2 size-8"}/>
                            </label>
                        </h2>
                        <ul className={"widget-container @max-3xl:peer-has-checked:hidden"}>
                            <li>
                                <a href="#" className={"cursor-default"}>
                                    <article className={"widget-item"}>
                                        <h3 className={"self-center text-xl font-bold"}>You didn't forget to <span
                                            className={"font-bold px-0.5"}>Water the plants</span>, did you?</h3>
                                        <p>You promised to do the following task: <span className={"font-bold px-0.5"}>Water the plants</span>!
                                            Don't let the others down!</p>
                                        <time className={"text-gray-400 text-xs self-end pr-2"}>Monday 16/07, 13:00 -
                                            19:00
                                        </time>
                                    </article>
                                </a>
                            </li>
                            <li>
                                <a href="#" className={"cursor-default"}>
                                    <article className={"widget-item"}>
                                        <h3 className={"self-center text-xl font-bold"}>News from project <span
                                            className={"font-bold px-0.5"}>Project</span>!</h3>
                                        <button title={"Remove this notification"} className={"button-destroy"}></button> {/* bgimg destroy icon (trash) + title text on hover + bgcol on hover */}
                                        <p><span className={"font-bold px-0.5"}>Project</span> updated their status!
                                            "Project now counts 12 members, and we can see the parc growing back!
                                            Flowers are blooming, even with this heat, and the grass is green again! …"
                                        </p>
                                        <p>Open the notification to learn more about it!</p>
                                        <time className={"text-gray-400 text-xs self-end pr-2"}>Sunday 15/07, 11:00
                                        </time>
                                    </article>
                                </a>
                            </li>
                        </ul>
                        <div className={"widget-openlink-container @max-3xl:peer-has-checked:hidden"}>
                            <a href={links.notifications}
                               className={"widget-openlink"}>More notifications</a>
                        </div>
                    </aside>


                    <div className={"flex flex-col items-center lg:flex-wrap lg:columns-2 gap-3"}>

                        <section className={"widget h-fit"}>
                            <h2 className={"widget-head"}>My next tasks</h2>
                            <ul className={"widget-container"}>

                                <li>
                                    <a href="#" className={"cursor-default"}>
                                        <article className={"widget-item"}>
                                            <h3 className={"self-center text-xl font-bold"}>Water the plants</h3>
                                            <p>The plants in our appartment’s shared garden need constant watering and
                                                care,
                                                especially
                                                if it didn’t rain.</p>
                                            <time className={"text-gray-400 text-xs self-end pr-2"}>Monday 16/07, 13:00
                                                -
                                                19:00
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

                </div>

            </div>
        </AppLayout>
    );
}

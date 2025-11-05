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
            <div className={"w-full max-w-7xl p-4 flex flex-col items-center lg:flex-wrap lg:columns-2 gap-3"}>

                <section className={"widget col-span-2 h-fit"}>
                    <h2 className={"widget-head bg-notifications"}>Notifications</h2>
                    <ul className={"flex flex-col gap-3 p-2 py-3"}>
                        <li>
                            <article className={"bg-background rounded-lg p-1 px-2 flex flex-col gap-1"}>
                                <h3 className={"self-center text-xl font-bold"}>You didn't forget to <a className={"font-bold px-0.5"} href={'#'}>Water the plants</a>, did you?</h3>
                                <p>You promised to do the following task: <a className={"font-bold px-0.5"} href={'#'}>Water the plants</a>! Don't let the others down!</p>
                                <time className={"text-gray-400 text-xs self-end pr-2"}>Monday 16/07, 13:00 - 19:00</time>
                            </article>
                        </li>
                    </ul>
                    <div className={"widget-openlink-container"}>
                        <a href={links.notifications}
                           className={"widget-openlink"}>More notifications</a>
                    </div>
                </section>

                <section className={"widget col-span-2 h-fit"}>
                    <h2 className={"widget-head"}>My next tasks</h2>
                    <ul className={"flex flex-col gap-3 p-2 py-3"}>

                        <li>
                            <article className={"bg-background rounded-lg p-1 px-2 flex flex-col gap-1"}>
                                <h3 className={"self-center text-xl font-bold"}>Water the plants</h3>
                                <p>The plants in our appartment’s shared garden need constant watering and care,
                                    especially
                                    if it didn’t rain.</p>
                                <time className={"text-gray-400 text-xs self-end pr-2"}>Monday 16/07, 13:00 - 19:00</time>
                            </article>
                        </li>

                        <li>
                            <article className={"bg-background rounded-lg p-1 px-2 flex flex-col gap-1"}>
                                <h3 className={"self-center text-xl font-bold"}>Start compost</h3>
                                <p>We're out of compost, and the bin is full, so it would be great if someone prepared some new one! Don't forget: Just put the bio garbage inside the bin and press the red button! Not the black one!</p>
                                <time className={"text-gray-400 text-xs self-end pr-2"}>Monday 16/07 - Friday 21/07</time>
                            </article>
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

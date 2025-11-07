import type {BreadcrumbItem} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Head} from "@inertiajs/react";
import {PersonStanding, Timer} from "lucide-react";

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

            <div className={"@container w-full max-w-7xl p-4 flex flex-col items-center gap-6"}>

                <div className="max-w-3xl flex flex-col gap-2">

                <h1 className={"text-4xl"}>Building 22b garden</h1>
                <p>
                    Everything is in the title. A little vegetable garden we share in the building 22b.
                    Stella and myself (Bob) are the creators of this project, and anyone from this building can join!
                    We mostly share what we produce when we want to add a little something non-industrial to our food.
                    We also make a vegetarian barbecue every summer with the gathered surplus!
                    It's not a real barbecue, since we don't cook any meat, but it's been our celebratory coutume for
                    two years now.
                    Just understand that you will have to work with us and respect some rules if you wanna be part of
                    this project.
                </p>

                <article className={"flex flex-col gap-1"}>
                    <h2 className={"pl-1 text-xl"}>Current status</h2>
                    <p>
                        Everything going well for our vegetable garden!
                        The plants are growing back since it's spring again, birds can't attack them anymore thanks to
                        the net we set up, and the rain keeps the soil moisty enought for them to grow up!
                        We'll have tomatoes and lemons in no time!
                        Keep the good work and regularity and the vegetarian summer barbecue will be great this year!
                    </p>
                    <small className={"text-gray-400 text-xs self-end pr-2"}>Posted the&nbsp;
                        <time>Monday 16/07, 15:37</time>
                    </small>
                </article>
                </div>

                <section className={"widget h-fit"}>
                    <h2 className={"widget-head"}>This project's next tasks</h2>
                    <ul className={"widget-container"}>

                        <li>
                            <a href="#" className={"cursor-default"}>
                                <article className={"widget-item"}>
                                    <h3 className={"text-center self-center text-xl font-bold"}>Water the plants in our
                                        vegetable garden</h3>
                                    <p>The plants in our appartment’s shared garden need constant watering and
                                        care, especially if it didn’t rain.</p>
                                    <div className={"taskinfo mt-1 flex justify-between items-center"}>
                                        <time className={"pl-1 flex gap-1"}>
                                            <Timer /> Monday 16/07, 13:00 - 19:00
                                        </time>
                                        <div className={"flex gap-1"}>
                                            <p className={"widget-item-icon bg-[var(--atomic-tangerine)]"}>0/1</p>
                                            <PersonStanding
                                                // title={"You are not participating"}
                                                className={"widget-item-icon bg-[var(--atomic-tangerine)]"}/>
                                        </div>
                                    </div>
                                </article>
                            </a>
                        </li>

                        <li>
                            <a href="#" className={"cursor-default"}>
                                <article className={"widget-item"}>
                                    <h3 className={"text-center self-center text-xl font-bold"}>Start compost</h3>
                                    <p>We're out of compost, and the bin is full, so it would be great if
                                        someone
                                        prepared some new one! Don't forget: Just put the bio garbage inside the
                                        bin
                                        and press the red button! Not the black one!</p>
                                    <div className={"taskinfo mt-1 flex justify-between items-center"}>
                                        <time className={"pl-1 flex gap-1"}><Timer /> Monday 16/07 -
                                            Friday
                                            21/07
                                        </time>
                                        <div className={"flex gap-1"}>
                                            <p className={"widget-item-icon"}>8/7</p>
                                            <PersonStanding
                                                // title={"You are participating"}
                                                className={"widget-item-icon"}/>
                                        </div>
                                    </div>
                                </article>
                            </a>
                        </li>

                    </ul>
                    <div className={"widget-openlink-container"}>
                        <a href={links.agenda}
                           className={"widget-openlink"}>Show project's agenda</a>
                    </div>
                </section>
            </div>


        </AppLayout>
    );
}

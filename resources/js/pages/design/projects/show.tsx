import type {BreadcrumbItem, ITaskItem} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Head} from "@inertiajs/react";
import {Calendar, Plus} from "lucide-react";
import TaskItem from "@/components/tasks/items/task-item";

const tasks: ITaskItem[] = [
    {
        title: "Water the plants in our vegetables garden",
        description: "The plants in our appartment’s shared garden need constant watering and care, especially if it didn’t rain.",
        time: "Monday 16/07, 13:00 - 19:00",
        href: "",
        participations: 0n,
        minParticipations: 1n,
        participating: false,
    },
    {
        title: "Start compost",
        description: "We're out of compost, and the bin is full, so it would be great if someone prepared some new one! Don't forget: Just put the bio garbage inside the bin and press the red button! Not the black one!",
        time: "Monday 16/07 - Friday 21/07",
        href: "",
        participations: 8n,
        minParticipations: 7n,
        participating: true,
    }
];

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

function ProjectTasks() {
    let i = 0;
    return tasks.map(task =>
        <li key={i++}>
            <TaskItem title={task.title} description={task.description} time={task.time} href={task.href}
                      participations={task.participations} minParticipations={task.minParticipations}
                      participating={task.participating}/>
        </li>
    );
}

export default function ProjectShow() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title}/>

            <div className={"@container w-full max-w-7xl p-4 flex flex-col items-center gap-8"}>

                <div className="max-w-3xl flex flex-col gap-3">

                    <h1 className={"text-4xl mb-1"}>Building 22b garden</h1>
                    <p>
                        Everything is in the title. A little vegetable garden we share in the building 22b. Stella and
                        myself (Bob) are the creators of this project, and anyone from this building can join! We mostly
                        share what we produce when we want to add a little something non-industrial to our food. We also
                        make a vegetarian barbecue every summer with the gathered surplus! It's not a real barbecue,
                        since we don't cook any meat, but it's been our celebratory coutume for two years now. Just
                        understand that you will have to work with us and respect some rules if you wanna be part of
                        this project.
                    </p>

                    <article className={"flex flex-col gap-0.5"}>
                        <h2 className={"text-2xl font-medium"}>Current status</h2>
                        <p>
                            Everything going well for our vegetable garden!
                            The plants are growing back since it's spring again, birds can't attack them anymore thanks
                            to
                            the net we set up, and the rain keeps the soil moisty enough for them to grow up!
                            We'll have tomatoes and lemons in no time!
                            Keep the good work and regularity and the vegetarian summer barbecue will be great this
                            year!
                        </p>
                        <small className={"postinfo"}>Posted on&nbsp;
                            <time>Monday 16/07, 15:37</time>
                        </small>
                    </article>
                </div>

                <section className={"widget h-fit"}>
                    <h2 className={"widget-head"}>This project's next tasks</h2>
                    <ul className={"widget-container"}>
                        <ProjectTasks/>
                    </ul>
                    <a href={links.agenda}
                       className={"widget-openlink"}>
                        <Calendar/>
                        Show project's agenda</a>
                    <a href="#"
                       className={"widget-openlink"}>
                        <Plus/>
                        Add task
                    </a>
                </section>


            </div>
        </AppLayout>
    );
}

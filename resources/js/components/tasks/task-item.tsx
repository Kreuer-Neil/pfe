import {CalendarCheck, CalendarClock, Timer, UsersRound} from "lucide-react";
import {IProjectContext, ITask, ITaskMiniature} from "@/types";
import {cn} from "@/lib/utils";
import {laravelDateToJsDate, upcomingDateToString} from "@/helpers/date";
import {ReactNode, useState} from "react";
import ProjectIcon from "@/components/icons/project-icon";
import {useTranslation} from "react-i18next";
import ModalCast from "@/components/modals/modal-cast";
import ModalSection from "@/components/modals/modal-section";
import {show as tasksShow} from "@/actions/App/Http/Controllers/TaskController";
import ReactModal from "react-modal";


interface TaskItemProps {
    taskMiniature: ITaskMiniature | ITask;
    className?: string;
    isInProjectPage: boolean;
    // taskShow: ((e:any) => void);
    // setModalTaskId: (id: string) => void;
}


function ParticipatingIcon({participating}: { participating: boolean }) {
    if (participating) {
        return (
            <CalendarCheck
                // title={"You are participating"}
                className="item-tag bg-tag-valid"/>
        );
    }
}

function TaskIconParticipation({participations, min, className = ''}: {
    participations: number,
    min?: number | null,
    className?: string
}) {
    if (min) {
        const colorClass: string = (participations / min > /*recommendedTaskParticipationsRate*/ .8)
            ? '' : "bg-warning text-warning-foreground";
        return (
            <span className={
                cn("item-tag",
                    colorClass,
                    className)
            }>
                {participations ?? 0}/{min}<UsersRound/>
        </span>
        );
    } else {
        return (
            <span className={
                cn("item-tag",
                    className)
            }>
                {participations ?? 0}<UsersRound/>
        </span>
        );
    }
}

function TaskTitle({isInProjectPage, project, children}: {
    children: string,
    project: IProjectContext,
    isInProjectPage: boolean
}): ReactNode {
    if (isInProjectPage)
        return (
            <h3 className="item-title w-full">{children}</h3>
        );

    return (
        <div className={'flex gap-1 justify-start items-center'}>
            <ProjectIcon project={project}/>
            <h3 className="item-title w-full">{children}</h3>
        </div>
    );
}

// TODO find where to put the link
export default function TaskItem(
    {
        taskMiniature,
        className = '',
        isInProjectPage = false,
        // taskShow
        // setModalTaskId,
    }: TaskItemProps) {
    const {t} = useTranslation(['projects', 'date']);
    const dueAt: string = taskMiniature.due_at ? upcomingDateToString(laravelDateToJsDate(taskMiniature.due_at)) : t('date:no_time_limit');

    // const dueAtYear: number = dueAt.getFullYear();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [task, setTask] = useState<ITaskMiniature | ITask>(taskMiniature);

    const onTap = () => {
        // TODO find how to optimize this (and avoid multiple code reception)
        if (!(typeof taskMiniature.description === "string")) {
            console.log(taskMiniature.description);
            const fetchTask = async (): Promise<ITask | undefined> => {
                try {
                    const params = new URLSearchParams();
                    params.append('task_id', taskMiniature.id);

                    const response = await fetch(`${tasksShow(taskMiniature.id).url}?${params}`);
                    const data: { task: ITask } = await response.json();
                    return (data.task);
                } catch (error) {
                    console.error(error);
                }
            }
            fetchTask().then((modalTask: ITask | undefined) => {
                if (!modalTask) {
                    //     setShowErrorModal(true);
                    return;
                }
                setTask(modalTask);
                setShowModal(true);
            });
        } else setShowModal(true);
    }

    return (
        <div>

            <article className={cn("thumbnail-item", className)} tabIndex={0} key={taskMiniature.id.toString()}
                     onClick={() => onTap()}
            >
                {/* TODO add open on click and not drag, see bsky duckduckgo etc. */}
                <TaskTitle isInProjectPage={isInProjectPage}
                           project={taskMiniature.project}>{taskMiniature.title}</TaskTitle>


                <p>{t('task_from_project', {project: taskMiniature.project.name})}</p>
                <div className="taskinfo mt-1 flex flex-wrap justify-between items-center gap-1">
                    <time className="flex gap-1"><Timer/><span>{dueAt}</span>
                    </time>
                    <div className="flex gap-1 ml-auto">
                        { /* TODO add PFPs of participating people */}
                        {/*<RelatedUsers/>*/}
                        <TaskIconParticipation participations={taskMiniature.participations_count}
                                               min={taskMiniature.min_participations}/>
                        <ParticipatingIcon participating={taskMiniature.self_participating}/>
                    </div>
                </div>
                {/*
                task.owner
                    ? <PostedBy owner={task.owner}/>
                    : ''
            */}


            </article>
            <ReactModal isOpen={showModal} appElement={document.querySelector('body')!} className="mx-2 my-3 max-w-3xl"
                        style={{overlay: {backgroundColor: 'var(--color-modal-behind)'},}}>
                <ModalCast title={task.title} closeModal={() => {
                    setShowModal(false)
                }}>

                    <ModalSection className="border-none">
                        <div className="flex gap-1">
                            <ProjectIcon project={task.project} size="small"/>
                            <p className="item-title">{task.project.name}</p>
                        </div>
                        {task.due_at ?
                            <p className="flex gap-1">
                                <CalendarClock/>{upcomingDateToString(laravelDateToJsDate(task.due_at))}
                            </p> : ''
                        }
                        <p className="mt-1">
                            {typeof task.description === "string" ? task.description: ''}
                        </p>
                    </ModalSection>

                    {/* Modal section */}
                    <ModalSection>
                        test
                    </ModalSection>
                </ModalCast>
            </ReactModal>

        </div>
    );
}

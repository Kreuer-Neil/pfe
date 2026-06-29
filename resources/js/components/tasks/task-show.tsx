import {ITask} from "@/types";
import {Dispatch, ReactNode, SetStateAction, useState} from "react";
import {useTranslation} from "react-i18next";
import CustomModal, {ModalContent, ModalFooter, ModalHeader, ModalTitle} from "@/components/modals/custom-modal";
import ProjectIcon from "@/components/icons/project-icon";
import {CalendarCheck, CalendarClock, Check, ClockAlert, UsersRound} from "lucide-react";
import TaskController from "@/actions/App/Http/Controllers/TaskController";
import RelatedUsers from "@/components/users/related-users";
import {Form, Link, router} from "@inertiajs/react";
import {show as projectsShow} from '@/actions/App/Http/Controllers/ProjectController';
import InputError from "@/components/input-error";
import {Field, FieldGroup, FieldSet} from "@/components/ui/field";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";

function Show({task, startEdit, onDelete, hasProjectContext}: {
    task: ITask | undefined,
    startEdit: (task: ITask) => void,
    onDelete: () => void,
    hasProjectContext: boolean
}) {
    const {t} = useTranslation(['projects', 'date', 'errors']);

    return (
        <>
            <ModalHeader>
                <ModalTitle>{task?.title ?? ''}</ModalTitle>
                <FieldGroup>
                    {hasProjectContext &&
                        <Link
                            className="item-title text-with-icon w-full"
                            href={task?.project ? projectsShow(task.project.slug).url : '#'}
                        >
                            <ProjectIcon
                                project={task?.project ?? {name: '', icon: '', slug: ''}}
                                size="small"
                            />
                            {task?.project.name ?? null}
                        </Link>
                    }
                    {task?.due_at &&
                        <p className="flex gap-1">
                            <CalendarClock/>
                            <time dateTime={task.due_at}>{task.due_at}</time>
                        </p>
                    }
                    <p className="mt-1">{task?.description ?? null}</p>
                </FieldGroup>
            </ModalHeader>

            <ModalContent>
                <FieldGroup>
                    <div className="flex wrap">
                        <div className="text-with-icon mr-auto">
                            {task?.related_users &&
                                <RelatedUsers profiles={task.related_users} isWithLinks/>
                            }
                            <p>
                                {task?.participations_count
                                    ? t('task_participations_count', {count: task.participations_count})
                                    : t('task_no_participations')
                                }
                            </p>
                        </div>
                        {task?.min_participations &&
                            <div className="text-with-icon">
                                <UsersRound className="item-tag"/>
                                <p>{t('task_recommended_participations_count', {count: task.min_participations})}</p>
                            </div>
                        }
                    </div>

                    {task?.self_participating &&
                        <div className="text-with-icon">
                            <CalendarCheck className="item-tag bg-tag"/>
                            <p>{t('task_self_participating')}</p>
                        </div>
                    }

                    {task?.validated &&
                        <div className="text-with-icon">
                            <Check className="item-tag"/>
                            <p>{t('task_valid')}</p>
                        </div>
                    }
                </FieldGroup>
                {/*<ModalSection title={t('task_note_title')} icon={Notebook}>
                            <NotesList task={task}/>

                        </ModalSection>*/}
            </ModalContent>

            <ModalFooter className="sm:justify-center pt-4 sm:flex-col">

                {task?.self_participating && !task?.validated
                    ? <Form
                        className="w-full flex justify-center"
                        {...TaskController.validate.form(task.id)}
                    >
                        {() => (
                            <Button type="submit" size="lg" className="w-full max-w-md">
                                {t('task_validate')}
                            </Button>
                        )}
                    </Form>
                    : !task?.validated &&
                    <Form
                        className="w-full flex justify-center col-span-2 sm:content-stretch"
                        {...TaskController.participate.form(task?.id ?? 0)}
                    >
                        {() => (
                            <Button type="submit" size="lg" className="w-full max-w-md">
                                {t('task_participate')}
                            </Button>
                        )}
                    </Form>
                }

                {task?.self_participating && !task?.validated &&
                    <Form
                        className="w-full flex justify-center"
                        {...TaskController.cancelParticipation.form(task.id)}
                    >
                        {() => (
                            <Button type="submit" size="lg" variant="destructive" className="w-full max-w-md">
                                {t('task_cancel_participate')}
                            </Button>
                        )}
                    </Form>
                }

                {task?.is_owner &&
                    <FieldGroup className="sm:grid sm:grid-cols-2 gap-2 w-full max-w-md self-center">
                        <Button variant="secondary" onClick={() => startEdit(task)} size="lg">
                            {t('task_edit')}
                        </Button>
                        <Button variant="destructive" onClick={onDelete} size="lg">
                            {t('task_delete')}
                        </Button>
                    </FieldGroup>
                }
            </ModalFooter>
        </>
    );
}

function Edit({task, setIsEditing}: {
    task: ITask | undefined;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
}): ReactNode {
    const {t} = useTranslation(['projects', 'date']);
    const [defaultDueAtDate, defaultDueAtTime] = task!.due_at.split(' ');

    return (
        <Form
            {...TaskController.update.form(task!.id)}
            className="flex flex-col gap-4"
        >
            {({errors}) => (
                <>
                    <ModalHeader>
                        <ModalTitle>
                            <Field>
                                <Label htmlFor="title">{t('task_form_title')}</Label>
                                <Input
                                    name="title"
                                    id="title"
                                    required
                                    defaultValue={task?.title}
                                />
                                <InputError message={errors.title}/>
                            </Field>
                        </ModalTitle>
                        <p className="item-title text-with-icon">
                            <ProjectIcon
                                project={task?.project ?? {name: '', icon: '', slug: ''}}
                                size="small"
                            />
                            {task?.project.name ?? null}
                        </p>
                    </ModalHeader>

                    <ModalContent>
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>
                                    <FieldGroup className="sm:flex-row">
                                        <Field>
                                            <Label htmlFor="due_at_date">{t('task_form_date')}</Label>
                                            <Input
                                                name="due_at_date"
                                                id="due_at_date"
                                                type="date"
                                                defaultValue={defaultDueAtDate}
                                            />
                                            <InputError message={errors.due_at_date}/>
                                        </Field>
                                        <Field>
                                            <Label htmlFor="due_at_time">{t('task_form_time')}</Label>
                                            <Input
                                                name="due_at_time"
                                                id="due_at_time"
                                                type="time"
                                                defaultValue={defaultDueAtTime}
                                            />
                                            <InputError message={errors.due_at_time}/>
                                        </Field>
                                    </FieldGroup>

                                    <Field>
                                        <Label htmlFor="description">{t('task_form_description')}</Label>
                                        <Textarea
                                            name="description"
                                            id="description"
                                            defaultValue={task?.description}
                                        />
                                        <InputError message={errors.description}/>
                                    </Field>
                                </FieldGroup>
                            </FieldSet>

                            <FieldSet>
                                <FieldGroup>
                                    <Field>
                                        <Label htmlFor="min_participations">
                                            {t('task_form_min_participations')}
                                        </Label>
                                        <Input
                                            name="min_participations"
                                            id="min_participations"
                                            type="number"
                                            defaultValue={task?.min_participations ?? undefined}
                                        />
                                        <InputError message={errors.min_participations}/>
                                    </Field>

                                    {task?.self_participating &&
                                        <p className="text-with-icon">
                                            <CalendarCheck className="item-tag bg-tag"/>
                                            {t('task_self_participating')}
                                        </p>
                                    }
                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </ModalContent>

                    <ModalFooter>
                        <FieldGroup className="gap-2 items-center max-w-md sm:grid sm:grid-cols-2">
                            <Button
                            size="lg"
                            className="w-full"
                                variant="secondary"
                                type="submit">
                                {t('task_confirm_changes')}
                            </Button>
                            <InputError message={errors.update}/>
                            <Button
                                size="lg"
                                className="w-full"
                                variant="destructive"
                                type="reset"
                                onClick={() => setIsEditing(false)}
                            >
                                {t('task_edit_cancel')}
                            </Button>
                        </FieldGroup>
                    </ModalFooter>
                </>
            )}
        </Form>
    );
}

export default function TaskShowModal({task, showModal, setShowModal, isInProjectPage, onDelete}: {
    task?: ITask,
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>,
    isInProjectPage: boolean,
    onDelete: () => void,
}): ReactNode {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    router.on('flash', (e) => {
        const flash = e.detail.flash;

        if (flash.task_edit_success) {
            setIsEditing(false);
        }
    });

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
    };

    return (
        <CustomModal showModal={showModal} onClose={closeModal} id="task-show">
            {!isEditing
                ? <Show
                    task={task}
                    startEdit={(t) => setIsEditing(true)}
                    onDelete={onDelete}
                    hasProjectContext={isInProjectPage}
                />
                : <Edit
                    task={task}
                    setIsEditing={setIsEditing}
                />
            }
        </CustomModal>
    );
}

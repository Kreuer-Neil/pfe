import {ClipboardCopy} from "lucide-react";
import CustomModal, {ModalContent, ModalHeader, ModalTitle} from "../modals/custom-modal";
import {Button} from "@/components/ui/button";
import {IProject} from "@/types";
import TaskController from "@/actions/App/Http/Controllers/TaskController";
import {Dispatch, SetStateAction, useState} from "react";
import {useTranslation} from "react-i18next";
import {Form, usePage} from "@inertiajs/react";
import InputError from "@/components/input-error";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Field, FieldGroup, FieldSet} from "@/components/ui/field";
import {Textarea} from "@/components/ui/textarea";

type CreatePageProps = {
    now: string;
}

export default function TaskCreateModal({showModal, setShowModal, project}: {
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>,
    project: IProject,
}) {

    const {now} = usePage<CreatePageProps>().props;
    const {t} = useTranslation(['projects', 'errors']);

    const defaultDatetime = now.split(' ');

    return (
        <CustomModal
            showModal={showModal}
            onClose={() => setShowModal(false)}
            id="task-create"
        >
            <ModalHeader>
                <ModalTitle>
                    {t('task_create_for_project', {project: project.name})}
                </ModalTitle>
            </ModalHeader>
            <ModalContent>
                <Form
                    {...TaskController.store.form()}
                    resetOnSuccess
                >
                    {({errors}) => (
                        <>
                            <input type="hidden" name="project_slug" value={project.slug}/>

                            <FieldGroup>
                                <FieldSet>
                                    <FieldGroup>
                                        <Field>
                                            <Label htmlFor="title">
                                                {t('task_form_title')}
                                            </Label>
                                            <Input
                                                name="title"
                                                id="title"
                                                placeholder={t('task_form_title_placeholder')}
                                                required
                                                autoFocus
                                            />
                                            <InputError message={errors.title}/>
                                        </Field>

                                        <Field>
                                            <Label htmlFor="description">
                                                {t('task_form_description')}
                                            </Label>
                                            <Textarea
                                                name="description"
                                                id="description"
                                                placeholder={t('task_form_description_placeholder')}
                                                required
                                            />
                                            <InputError message={errors.description}/>
                                        </Field>
                                    </FieldGroup>
                                </FieldSet>
                                <FieldSet>
                                {/* TODO switch
                        <div className="flex">
                            <span className="mr-auto">{t('task_form_starting_time')}</span>
                            <button />
                        </div>*/}
                                    <FieldGroup className="sm:grid sm:grid-cols-2 sm:gap-4">
                                        <Field>
                                            <Label htmlFor="due_date">
                                                {t('task_form_due_date')}
                                            </Label>
                                            <Input
                                                name="due_date"
                                                id="due_date"
                                                type="date"
                                                defaultValue={defaultDatetime[0]}
                                                required
                                            />
                                            <InputError message={errors.due_date}/>
                                        </Field>

                                        <Field>
                                            <Label htmlFor="due_time">
                                                {t('task_form_due_time')}
                                            </Label>
                                            <Input
                                                name="due_time"
                                                id="due_time"
                                                type="time"
                                                defaultValue={defaultDatetime[1]}
                                                required
                                            />
                                            <InputError message={errors.due_time}/>
                                        </Field>
                                        <InputError message={errors.due_at}
                                                    className="col-span-1"
                                        />
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
                                                min={1}
                                            />
                                            <InputError message={errors.min_participations}/>
                                        </Field>
                                    </FieldGroup>
                                </FieldSet>

                                <Field>
                                    <Button type="submit">
                                        {t('task_create_button')}
                                    </Button>
                                    <InputError message={errors.general}/>
                                    {/*
                        <Button
                            variant="ghost"
                            // TODO setup
                        >
                            <ClipboardCopy/>
                            {t('task_create_fill')}
                        </Button>
                        */}
                                </Field>
                            </FieldGroup>
                        </>
                    )}
                </Form>
            </ModalContent>
        </CustomModal>
    );
}

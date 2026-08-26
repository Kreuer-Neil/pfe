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
    const {t} = useTranslation(['tasks', 'errors']);

    const defaultDatetime = now.split(' ');

    return (
        <CustomModal
            showModal={showModal}
            onClose={() => setShowModal(false)}
            id="task-create"
        >
            <ModalHeader>
                <ModalTitle>
                    {t('create_for_project', {project: project.name})}
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
                                                {t('form_title')}
                                            </Label>
                                            <Input
                                                name="title"
                                                id="title"
                                                placeholder={t('form_title_placeholder')}
                                                required
                                                autoFocus
                                            />
                                            <InputError message={errors.title}/>
                                        </Field>

                                        <Field>
                                            <Label htmlFor="description">
                                                {t('form_description')}
                                            </Label>
                                            <Textarea
                                                name="description"
                                                id="description"
                                                placeholder={t('form_description_placeholder')}
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
                                                {t('form_due_date')}
                                            </Label>
                                            <Input
                                                name="due_date"
                                                id="due_date"
                                                type="date"
                                                defaultValue={defaultDatetime[0]}
                                            />
                                            <InputError message={errors.due_date}/>
                                        </Field>

                                        <Field>
                                            <Label htmlFor="due_time">
                                                {t('form_due_time')}
                                            </Label>
                                            <Input
                                                name="due_time"
                                                id="due_time"
                                                type="time"
                                                defaultValue={defaultDatetime[1]}
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
                                                {t('form_min_participations')}
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
                                        {t('create_button')}
                                    </Button>
                                    <InputError message={errors.general}/>
                                    {/*
                        <Button
                            variant="ghost_accent"
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

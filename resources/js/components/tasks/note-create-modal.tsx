import {Dispatch, SetStateAction} from "react";
import {useTranslation} from "react-i18next";
import {Form} from "@inertiajs/react";
import CustomModal, {ModalContent, ModalHeader, ModalTitle} from "@/components/modals/custom-modal";
import {Field, FieldGroup} from "@/components/ui/field";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import InputError from "@/components/input-error";
import TaskNoteController from "@/actions/App/Http/Controllers/TaskNoteController";
import {ITask} from "@/types";

export default function NoteCreateModal({showModal, setShowModal, task}: {
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>,
    task: ITask,
}) {
    const {t} = useTranslation(['projects', 'errors']);

    return (
        <CustomModal
            showModal={showModal}
            onClose={() => setShowModal(false)}
            id="note-create"
        >
            <ModalHeader>
                <ModalTitle>{t('add_note')}</ModalTitle>
            </ModalHeader>
            <ModalContent>
                <Form
                    {...TaskNoteController.store.form(task.id)}
                    resetOnSuccess
                    onSuccess={() => setShowModal(false)}
                >
                    {({errors}) => (
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="content">
                                    {t('field_note_content')}
                                </Label>
                                <Textarea
                                    name="content"
                                    id="content"
                                    placeholder={t('note_content_placeholder')}
                                    required
                                    autoFocus
                                    rows={4}
                                />
                                <InputError message={errors.content}/>
                            </Field>
                            <Field>
                                <Button type="submit">
                                    {t('add_note')}
                                </Button>
                                <InputError message={errors.general}/>
                            </Field>
                        </FieldGroup>
                    )}
                </Form>
            </ModalContent>
        </CustomModal>
    );
}

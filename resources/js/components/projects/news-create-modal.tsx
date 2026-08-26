import CustomModal, {ModalContent, ModalHeader, ModalTitle} from "@/components/modals/custom-modal";
import {Dispatch, SetStateAction} from "react";
import {useTranslation} from "react-i18next";
import {Form} from "@inertiajs/react";
import InputError from "@/components/input-error";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Field, FieldGroup} from "@/components/ui/field";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import ProjectNewsController from "@/actions/App/Http/Controllers/ProjectNewsController";

export default function NewsCreateModal({showModal, setShowModal, slug}: {
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>,
    slug: string,
}) {
    const {t} = useTranslation('projects');

    return (
        <CustomModal
            showModal={showModal}
            onClose={() => setShowModal(false)}
            id="news-create"
        >
            <ModalHeader>
                <ModalTitle>
                    {t('news_create_title')}
                </ModalTitle>
            </ModalHeader>
            <ModalContent>
                <Form
                    {...ProjectNewsController.store.form(slug)}
                    resetOnSuccess
                    onSuccess={() => setShowModal(false)}
                >
                    {({errors}) => (
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="news-title">
                                    {t('news_form_title')}
                                </Label>
                                <Input
                                    name="title"
                                    id="news-title"
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.title}/>
                            </Field>

                            <Field>
                                <Label htmlFor="news-text-content">
                                    {t('news_form_content')}
                                </Label>
                                <Textarea
                                    name="text_content"
                                    id="news-text-content"
                                    required
                                />
                                <InputError message={errors.text_content}/>
                            </Field>

                            <Field>
                                <Button type="submit">
                                    {t('news_form_submit')}
                                </Button>
                            </Field>
                        </FieldGroup>
                    )}
                </Form>
            </ModalContent>
        </CustomModal>
    );
}

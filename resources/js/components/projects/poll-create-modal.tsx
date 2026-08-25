import CustomModal, {ModalContent, ModalHeader, ModalTitle} from "@/components/modals/custom-modal";
import {Dispatch, SetStateAction, useState} from "react";
import {useTranslation} from "react-i18next";
import {Form} from "@inertiajs/react";
import InputError from "@/components/input-error";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Field, FieldGroup} from "@/components/ui/field";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {Plus, Trash2} from "lucide-react";
import ProjectPollController from "@/actions/App/Http/Controllers/ProjectPollController";

export default function PollCreateModal({showModal, setShowModal, slug}: {
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>,
    slug: string,
}) {
    const {t} = useTranslation('projects');

    const [multi, setMulti] = useState(false);
    const [choiceRows, setChoiceRows] = useState<number[]>([0, 1]);
    const nextRowId = choiceRows.length > 0 ? Math.max(...choiceRows) + 1 : 0;

    function reset() {
        setMulti(false);
        setChoiceRows([0, 1]);
    }

    return (
        <CustomModal
            showModal={showModal}
            onClose={() => setShowModal(false)}
            id="poll-create"
        >
            <ModalHeader>
                <ModalTitle>
                    {t('poll_create_title')}
                </ModalTitle>
            </ModalHeader>
            <ModalContent>
                <Form
                    {...ProjectPollController.store.form(slug)}
                    resetOnSuccess
                    onSuccess={() => {
                        setShowModal(false);
                        reset();
                    }}
                >
                    {({errors}) => (
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="poll-title">
                                    {t('poll_form_title')}
                                </Label>
                                <Input
                                    name="title"
                                    id="poll-title"
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.title}/>
                            </Field>

                            <Field orientation="horizontal">
                                <Label htmlFor="poll-multi">
                                    {t('poll_form_multi')}
                                </Label>
                                <Switch
                                    id="poll-multi"
                                    checked={multi}
                                    onCheckedChange={setMulti}
                                />
                                <input type="hidden" name="multi" value={multi ? '1' : '0'}/>
                            </Field>

                            <Field>
                                <Label htmlFor="poll-end-date">
                                    {t('poll_form_end_date')}
                                </Label>
                                <Input
                                    name="end_date"
                                    id="poll-end-date"
                                    type="datetime-local"
                                    required
                                />
                                <InputError message={errors.end_date}/>
                            </Field>

                            <Field>
                                <Label>
                                    {t('poll_form_choices')}
                                </Label>
                                <div className="flex flex-col gap-2">
                                    {choiceRows.map((rowId, index) => (
                                        <div key={rowId} className="flex gap-2">
                                            <Input
                                                name="choices[]"
                                                placeholder={t('poll_form_choice_placeholder', {n: index + 1})}
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                disabled={choiceRows.length <= 2}
                                                onClick={() => setChoiceRows((rows) => rows.filter((id) => id !== rowId))}
                                            >
                                                <span className="sr-only">{t('poll_form_remove_choice')}</span>
                                                <Trash2/>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="w-fit"
                                    disabled={choiceRows.length >= 10}
                                    onClick={() => setChoiceRows((rows) => [...rows, nextRowId])}
                                >
                                    <Plus/>
                                    {t('poll_form_add_choice')}
                                </Button>
                                <InputError message={errors.choices}/>
                            </Field>

                            <Field>
                                <Button type="submit">
                                    {t('poll_form_submit')}
                                </Button>
                            </Field>
                        </FieldGroup>
                    )}
                </Form>
            </ModalContent>
        </CustomModal>
    );
}

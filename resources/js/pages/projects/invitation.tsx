import {Form, Head, router} from '@inertiajs/react'
import AppLayout from "@/layouts/app-layout";
import PageFlowContainer from "@/components/page-flow-container";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Field, FieldGroup} from "@/components/ui/field";
import InputError from "@/components/input-error";
import ProjectInvitationController from "@/actions/App/Http/Controllers/ProjectInvitationController";
import CustomModal from "@/components/modals/custom-modal";


export default function invitation({ code: initialCode = '' }: { code?: string }) {
    const {t} = useTranslation('projects');

    const [code, setCode] = useState<string>(initialCode);

    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        return router.on('flash', (e) => {
            if (e.detail.flash.confirm) {
                setShowConfirmation(true);
                setCode(e.detail.flash.code as string);
            }
        });
    }, []);

    return (
        <AppLayout>
            <Head title="invitation"/>
            <PageFlowContainer>
                <div className="modal border border-border max-w-sm">
                    <h1 className="page-title">{t('invitation_index')}</h1>

                    <Form
                        {...ProjectInvitationController.use.form()}
                    >
                        {({processing, errors}) => (
                            <FieldGroup>
                                <div>

                                    <Field>
                                        <Label htmlFor="code">{t('invitation_code')}</Label>
                                        <Input name="code" id="code" value={code} required
                                               onChange={(e) => setCode(e.target.value)}/>
                                        <InputError message={errors.code}/>
                                    </Field>
                                </div>

                                <Button type="submit">{t('invitation_use')}</Button>
                            </FieldGroup>
                        )}
                    </Form>
                </div>
            </PageFlowContainer>
            <CustomModal showModal={showConfirmation} onClose={() => setShowConfirmation(false)}
                         id="invitation-confirm" className="max-w-sm">
                <h1 className="page-title">{t('invitation_index')}</h1>

                <Form
                    {...ProjectInvitationController.use.form()}
                >
                    {({processing, errors}) => (
                        <FieldGroup>
                            <input type="hidden" name="confirm" value={1}/>
                            <input type="hidden" name="code" value={code}/>
                            <Button type="submit">{t('invitation_confirm')}</Button>
                        </FieldGroup>
                    )}
                </Form>
            </CustomModal>
        </AppLayout>
    )
}

import {Form, Head, router, usePage} from '@inertiajs/react'
import AppLayout from "@/layouts/app-layout";
import PageFlowContainer from "@/components/page-flow-container";
import {useTranslation} from "react-i18next";
import GeneralInput from "@/components/form/general-input";
import {useState} from "react";
import Button from "@/components/buttons/button";
import ProjectInvitationController from "@/actions/App/Http/Controllers/ProjectInvitationController";
import CustomModal from "@/components/modals/custom-modal";
import ConfirmModal from "@/components/modals/confirm-modal";
import {IProjectShow} from "@/types";


export default function invitation({}: {}) {
    const {t} = useTranslation('projects');


    const [error, setError] = useState('');

    const [code, setCode] = useState<string>('');

    const [showConfirmation, setShowConfirmation] = useState(false);

    // TODO c lean this mess
    router.on('flash', (e) => {
        if (e.detail.flash.confirm) {
            setShowConfirmation(true);
            // @ts-ignore
            setCode(e.detail.flash.code);
        }
    });

    return (
        <AppLayout>
            <Head title="invitation"/>
            <PageFlowContainer>
                <div className="modal border border-border max-w-sm">
                    <h1 className="page-title">{t('invitation_index')}</h1>

                    <Form
                        {...ProjectInvitationController.use.form(code)}
                    >
                        {({processing, errors}) => (
                            <>
                                <div className="modal">

                                    <GeneralInput name="invitation_code" label={t('invitation_code')} value={code}
                                                  setValue={setCode} required={true}/>
                                    {error &&
                                        <span className="field-error">{error}</span>}
                                </div>

                                <Button textContent={t('invitation_use')} type="submit" onClick={() => null}/>
                            </>
                        )}
                    </Form>
                </div>
            </PageFlowContainer>
            <CustomModal showModal={showConfirmation} onClose={() => setShowConfirmation(false)}
                         id="invitation-confirm" className="max-w-sm">
                <h1 className="page-title">{t('invitation_index')}</h1>

                <Form
                    {...ProjectInvitationController.use.form(code)}
                >
                    {({processing, errors}) => (
                        <>
                            <input type="hidden" name="confirm" value={1}/>
                            <Button textContent={t('invitation_confirm')} type="submit" onClick={() => null}/>
                        </>
                    )}
                </Form>
            </CustomModal>
        </AppLayout>
    )
}

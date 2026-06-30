import {Form, Head, router} from '@inertiajs/react'
import AppLayout from "@/layouts/app-layout";
import PageFlowContainer from "@/components/page-flow-container";
import {useTranslation} from "react-i18next";
import GeneralInput from "@/components/form/general-input";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import ProjectInvitationController from "@/actions/App/Http/Controllers/ProjectInvitationController";
import CustomModal from "@/components/modals/custom-modal";


export default function invitation({}: {}) {
    const {t} = useTranslation('projects');
    
    const [code, setCode] = useState<string>(document.documentURI.split('code=')[1] ?? '');

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
                        {...ProjectInvitationController.use.form()}
                    >
                        {({processing, errors}) => (
                            <>
                                <div className="modal">

                                    <GeneralInput name="code" label={t('invitation_code')} value={code} required={true}/>
                                    {errors.code &&
                                        <span className="field-error">{errors.code}</span>}
                                </div>

                                <Button type="submit">{t('invitation_use')}</Button>
                            </>
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
                        <>
                            <input type="hidden" name="confirm" value={1}/>
                            <input type="hidden" name="code" value={code}/>
                            <Button type="submit">{t('invitation_confirm')}</Button>
                        </>
                    )}
                </Form>
            </CustomModal>
        </AppLayout>
    )
}
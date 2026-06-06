import {Form, Head, usePage} from "@inertiajs/react";
import ProjectInvitationController from "@/actions/App/Http/Controllers/ProjectInvitationController";
import GeneralInput from "@/components/form/general-input";
import Button from "@/components/buttons/button";
import {useTranslation} from "react-i18next";
import {IProjectShow} from "@/types";
import PageFlowContainer from "@/components/page-flow-container";
import AppLayout from "@/layouts/app-layout";

type PageProps = {
    code?: string;
    project: IProjectShow;
}

export default function AcceptInvitation() {
    const {t} = useTranslation('projects');

    const {code, project} = usePage<PageProps>().props;

    return (
        <AppLayout>
            <Head title="invitation"/>
            <PageFlowContainer>
                    <div className="modal border border-border max-w-sm">
                        <h1 className="page-title">{t('invitation_index')}</h1>

                        <Form
                            {...ProjectInvitationController.use.form(code ?? '')}
                        >
                            {({processing, errors}) => (
                                <>
                                    <input type="hidden" name="confirm" value={1}/>
                                    <Button textContent={t('invitation_confirm')} type="submit" onClick={()=>null}/>
                                </>
                            )}
                        </Form>
                    </div>
            </PageFlowContainer>
        </AppLayout>
    )
}

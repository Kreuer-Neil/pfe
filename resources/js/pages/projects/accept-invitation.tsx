import {Form, Head, usePage} from "@inertiajs/react";
import ProjectInvitationController from "@/actions/App/Http/Controllers/ProjectInvitationController";
import {Button} from "@/components/ui/button";
import {useTranslation} from "react-i18next";
import {IProjectShow} from "@/types";
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
            <div className="modal border border-border max-w-sm">
                <h1 className="page-title">{t('invitation_index')}</h1>

                <Form
                    {...ProjectInvitationController.use.form()}
                >
                    {({processing, errors}) => (
                        <>
                            <input type="hidden" name="confirm" value={1}/>
                            <Button type="submit">{t('invitation_confirm')}</Button>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    )
}
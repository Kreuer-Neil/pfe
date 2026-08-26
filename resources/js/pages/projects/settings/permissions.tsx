import Layout from '@/layouts/app-layout'
import ProjectSettingsLayout from '@/layouts/projects/settings-layout'
import {Form, Head, usePage} from '@inertiajs/react'
import ProjectController from "@/actions/App/Http/Controllers/ProjectController";
import {IProjectSettings} from "@/types";
import {Field, FieldDescription, FieldGroup, FieldLegend, FieldSet} from "@/components/ui/field";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import InputError from "@/components/input-error";
import {useState} from "react";

type PageProps = {
    project: IProjectSettings;
}

export default function ProjectSettingsPermissions({}) {
    const {t} = useTranslation(['projects', 'common']);
    const {project} = usePage<PageProps>().props;

    const [updateSuccessMessage, setUpdateSuccessMessage] = useState(false);

    return (
        <Layout className="px-3">
            <Head title={t('project_settings_permissions_title')}/>
            <ProjectSettingsLayout project={project}>
                <Form
                    {...ProjectController.updatePermissions.form(project.slug)}
                    className="w-full"
                    onSuccess={() => setUpdateSuccessMessage(true)}
                >
                    {({errors}) => (
                        <FieldGroup>
                            <FieldSet>
                                <FieldLegend>{t('project_permissions_invitations_title')}</FieldLegend>
                                <FieldGroup>
                                    <Field orientation="horizontal">
                                        <Label>{t('project_permissions_allow_invitations')}</Label>
                                        <Switch
                                            name="allow_members_invitations"
                                            defaultChecked={project.permissions.allow_members_invitations}
                                            value={1}
                                        />
                                        <InputError message={errors.allow_members_invitations}/>
                                    </Field>
                                    <FieldDescription>{t('project_permissions_allow_invitations_description')}</FieldDescription>
                                </FieldGroup>
                            </FieldSet>
                            <Field>
                                <Button type="submit">{t('common:save_changes')}</Button>
                                <InputError className="text-green-700"
                                            message={updateSuccessMessage ? t('common:changes_saved') : undefined}/>
                            </Field>
                        </FieldGroup>
                    )}
                </Form>
            </ProjectSettingsLayout>
        </Layout>
    );
}

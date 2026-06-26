import Layout from '@/layouts/app-layout'
import {Form, Head, usePage} from '@inertiajs/react'
import PageFlowContainer from "@/components/page-flow-container";
import ProjectController from "@/actions/App/Http/Controllers/ProjectController";
import {IProject} from "@/types";
import {Field, FieldDescription, FieldGroup, FieldSet, FieldTitle} from "@/components/ui/field";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";


type EditPageProps = {
    project: IProject;
}
export default function ProjectsEdit({}) {
    const {t} = useTranslation(['projects']);
    const {project} = usePage<EditPageProps>().props;

    return (
        <Layout>
            <Head title={t('project_edit_title')}/>
            <PageFlowContainer>

                <Form
                    {...ProjectController.updateAppearance.form(project.slug)}
                >
                    <FieldGroup>

                        {/*<Avatar>
                            <AvatarImage/>
                        </Avatar>*/}
                        <FieldSet>
                            <FieldTitle>
                                {t('project_form_appearance_title')}
                            </FieldTitle>
                            <FieldGroup>
                                <Field>

                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <Field>
                            <Button
                                type="submit"
                            >
                                {t('common:save_changes')}
                            </Button>
                        </Field>
                    </FieldGroup>
                </Form>
                <Form
                    {...ProjectController.updateTags().form(project.slug)}
                >

                </Form>

            </PageFlowContainer>
        </Layout>
    )
}

import Layout from '@/layouts/app-layout'
import {Form, Head, usePage} from '@inertiajs/react'
import PageFlowContainer from "@/components/page-flow-container";
import {useTranslation} from "react-i18next";
import ProjectController from "@/actions/App/Http/Controllers/ProjectController";
import {Fragment, useState} from "react";
import InputError from "@/components/input-error";
import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList,
    ComboboxValue, useComboboxAnchor
} from "@/components/ui/combobox";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Field, FieldDescription, FieldGroup, FieldLegend, FieldSet} from "@/components/ui/field";
import {Textarea} from "@/components/ui/textarea";
import {Separator} from "@/components/ui/separator";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";
import LocationSearch from "@/components/location-search";

type PageProps = {
    tagsList: Array<string>;
}

export default function projectsCreate({}) {

    const {tagsList} = usePage<PageProps>().props;

    const {t} = useTranslation(['projects', 'tags']);

    const [tags, setTags] = useState<Array<string>>();
    const anchor = useComboboxAnchor();

    return (
        <Layout>
            <Head title="create"/>
            <PageFlowContainer>
                <h1 className="page-title w-full px-3">{t('Create a project')}</h1>

                <Form
                    {...ProjectController.store.form()}
                    disableWhileProcessing
                    className="w-full max-w-xl px-3"
                >
                    {({errors,}) => (
                        <>
                            <FieldGroup>

                                <FieldSet>
                                    {/* TODO see figma for title & desc. */}
                                    <FieldLegend>{t('create_text_title')}</FieldLegend>
                                    <FieldDescription>
                                        {t('create_text_description')}
                                    </FieldDescription>
                                    {/* TODO add project icon? */}
                                    <FieldGroup>

                                        <Field>
                                            <Label>
                                                {t('project_form_name')}
                                            </Label>
                                            <Input name="name"
                                                   id="name"
                                                   required
                                            />
                                            <InputError message={errors.name}/>
                                        </Field>

                                        <Field>
                                            <Label>
                                                {t('project_form_description')}
                                            </Label>
                                            <Textarea name="description"
                                                      id="description"
                                                      required
                                            />
                                            <InputError message={errors.description}/>
                                        </Field>
                                        {/*<FieldDescription className="sr-only">{t('project_form_main_informations')}</FieldDescription>*/}
                                    </FieldGroup>
                                </FieldSet>
                                <Separator/>
                                <FieldGroup>
                                    <Field orientation="horizontal">
                                        <Label>
                                            {t('project_form_private')}
                                        </Label>
                                        {/*<FieldDescription className="sr-only">{t('settings')}</FieldDescription>*/}
                                        <Switch name="is_private"
                                                defaultChecked={true}
                                                value={1}
                                        />
                                        <InputError message={errors.is_private}/>
                                    </Field>
                                    <FieldDescription>{t('project_form_private_warning')}</FieldDescription>
                                </FieldGroup>
                                <Separator/>
                                <FieldGroup>
                                    <Field>
                                        <Label>
                                            {/* Project tags */}
                                            {t('field_tags')}
                                        </Label>
                                        <Combobox
                                            // name="tags"
                                            id="tags-select"
                                            multiple
                                            autoHighlight
                                            items={tagsList}
                                            limit={7}
                                            onValueChange={(values: Array<string>) => setTags(values ?? [])}
                                        >
                                            <ComboboxChips ref={anchor} className="w-full max-w-xs">
                                                <ComboboxValue>
                                                    {(values) => (
                                                        <Fragment>
                                                            {values.map((value: string) => (
                                                                <ComboboxChip
                                                                    key={value}>{t('tags:' + value)}</ComboboxChip>
                                                            ))}
                                                            <ComboboxChipsInput/>
                                                        </Fragment>
                                                    )}
                                                </ComboboxValue>
                                            </ComboboxChips>
                                            <ComboboxContent anchor={anchor}>
                                                <ComboboxEmpty>{t('common:multiselect_no_items')}</ComboboxEmpty>
                                                <ComboboxList>
                                                    {(item) => (
                                                        <ComboboxItem key={item} value={item}>
                                                            {t('tags:' + item)}
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>
                                        {tags?.length &&
                                            tags?.map((tag, i)=> {
                                                return <Input type="hidden" name={'tags.'+i} value={tag} key={i}/>;
                                            })
                                        }
                                        <InputError message={errors.tags}/>
                                    </Field>
                                </FieldGroup>
                                
                                <Separator/>

                                <LocationSearch legend={t('project_form_location_title')} errors={errors}/>

                                <div className="flex flex-col gap-3 px-2 items-center pt-3">
                                    <Button type="submit">
                                        {t('project_form_create')}
                                    </Button>
                                </div>
                            </FieldGroup>
                        </>
                    )}
                </Form>

            </PageFlowContainer>
        </Layout>
    )
}

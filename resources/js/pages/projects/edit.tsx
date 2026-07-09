import Layout from '@/layouts/app-layout'
import {Form, Head, Link, usePage} from '@inertiajs/react'
import ProjectController from "@/actions/App/Http/Controllers/ProjectController";
import ProjectInvitationController from "@/actions/App/Http/Controllers/ProjectInvitationController";
import {IProjectInvitation, IProjectSettings} from "@/types";
import {Field, FieldDescription, FieldGroup, FieldLegend, FieldSet} from "@/components/ui/field";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {
    Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput,
    ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList,
    ComboboxValue, useComboboxAnchor
} from "@/components/ui/combobox";
import {Fragment, useState} from "react";
import {Input} from "@/components/ui/input";
import InputError from "@/components/input-error";
import {Textarea} from "@/components/ui/textarea";
import {Switch} from "@/components/ui/switch";
import {Separator} from "@/components/ui/separator";
import {Camera, EllipsisVertical, SquareArrowOutUpRight, Trash2} from "lucide-react";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {Item, ItemContent, ItemDescription, ItemTitle, ItemFooter, ItemActions} from "@/components/ui/item";
import {Badge} from "@/components/ui/badge";
import {useImageAsset} from "@/hooks/use-image-asset";
import {show as showProfile} from '@/actions/App/Http/Controllers/UserProfileController'
import LocationSearch from "@/components/location-search";
import ConfirmModal from "@/components/modals/confirm-modal";
import {laravelDateToJsDate, upcomingDateToString} from "@/helpers/date";

type EditPageProps = {
    project: IProjectSettings;
    tagsList: Array<string>;
}

export default function ProjectsEdit({}) {
    const {t} = useTranslation(['projects', 'tags', 'common']);
    const {project, tagsList} = usePage<EditPageProps>().props;

    const [localFilePath, setLocalFilePath] = useState<string | undefined>(undefined);
    const iconPath = localFilePath ?? useImageAsset('projects/' + project.icon + '/large');

    const [updateSuccessMessage, setUpdateSuccessMessage] = useState<'appearance' | 'visibility' | 'tags' | 'location' | null>(null)

    const [tags, setTags] = useState<Array<string>>(project.tags ?? []);
    const anchor = useComboboxAnchor();

    const [revokeTarget, setRevokeTarget] = useState<IProjectInvitation | null>(null);
    const canManageInvitations = project.user_role === 'admin' || project.user_role === 'moderator';

    return (
        <Layout className="px-3">
            <Head title={t('project_edit_title')}/>
            <Form
                    {...ProjectController.updateAppearance.form(project.slug)}
                    className="w-full"
                    onSuccess={() => setUpdateSuccessMessage('appearance')}
                >
                    {({errors}) => (
                        <FieldGroup>
                            <FieldSet>
                                <FieldLegend>{t('project_form_appearance_title')}</FieldLegend>
                                <Field>

                                    <label htmlFor="icon"
                                           className="block w-fit! cursor-pointer rounded-full relative"
                                    >
                                        <span className="sr-only">{t('field_icon')}</span>
                                        <img
                                            src={iconPath}
                                            alt={t('icon_alt', {project: project.name})}
                                            className="size-28 bg-secondary rounded-full object-cover"
                                        />
                                        <Camera
                                            className="bg-background text-secondary-border rounded-full absolute bottom-0 right-0 z-10"/>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpg, image/jpeg, image/webp, image/gif"
                                            name="icon"
                                            id="icon"
                                            className="image-input sr-only"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setLocalFilePath(URL.createObjectURL(e.target.files[0]));
                                                }
                                            }}
                                        />
                                    </label>
                                </Field>
                                <InputError className="mt-6 mx-3" message={errors.icon}/>

                                <FieldGroup>
                                    <Field>
                                        <Label>{t('project_form_name')}</Label>
                                        <Input
                                            name="name"
                                            id="name"
                                            defaultValue={project.name}
                                            required
                                        />
                                        <InputError message={errors.name}/>
                                    </Field>

                                    <Field>
                                        <Label>{t('project_form_description')}</Label>
                                        <Textarea
                                            name="description"
                                            id="description"
                                            defaultValue={project.description}
                                            required
                                        />
                                        <InputError message={errors.description}/>
                                    </Field>
                                </FieldGroup>
                            </FieldSet>

                            <Field>
                                <Button type="submit">
                                    {t('common:save_changes')}
                                </Button>
                                <InputError className="text-green-700"
                                            message={updateSuccessMessage === 'appearance' ? t('common:changes_saved') : undefined}/>
                            </Field>
                        </FieldGroup>
                    )}
                </Form>

                <Separator/>

                <Form
                    {...ProjectController.updateVisibility.form(project.slug)}
                    className="w-full"
                    onSuccess={() => setUpdateSuccessMessage('visibility')}
                >
                    {({errors}) => (
                        <FieldGroup>
                            <FieldSet>
                                <FieldLegend>{t('project_form_visibility_title')}</FieldLegend>
                                <FieldGroup>
                                    <Field orientation="horizontal">
                                        <Label>{t('project_form_private')}</Label>
                                        <Switch
                                            name="is_private"
                                            defaultChecked={project.is_private}
                                            value={1}
                                        />
                                        <InputError message={errors.is_private}/>
                                    </Field>
                                    <FieldDescription>{t('project_form_private_warning')}</FieldDescription>
                                </FieldGroup>
                            </FieldSet>
                            <Field>
                                <Button type="submit">{t('common:save_changes')}</Button>
                                <InputError className="text-green-700"
                                            message={updateSuccessMessage === 'visibility' ? t('common:changes_saved') : undefined}/>
                            </Field>
                        </FieldGroup>
                    )}
                </Form>

                <Separator/>

                <Form
                    className="w-full"
                    {...ProjectController.updateTags.form(project.slug)}
                    onSuccess={() => setUpdateSuccessMessage('tags')}
                >
                    {({errors}) => (
                        <FieldGroup>
                            <FieldSet>
                                <FieldLegend>{t('field_tags')}</FieldLegend>
                                <Field>
                                    <Combobox
                                        id="tags-select"
                                        multiple
                                        autoHighlight
                                        items={tagsList}
                                        itemToStringLabel={(tag: string) => t('tags:' + tag)}
                                        limit={7}
                                        defaultValue={project.tags}
                                        onValueChange={(values: Array<string>) => setTags(values ?? [])}
                                    >
                                        <ComboboxChips ref={anchor} className="w-full max-w-xs">
                                            <ComboboxValue>
                                                {(values) => (
                                                    <Fragment>
                                                        {values.map((value: string) => (
                                                            <ComboboxChip key={value}>
                                                                {t('tags:' + value)}
                                                            </ComboboxChip>
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
                                    {tags?.map((tag, i) => (
                                        <Input key={tag} type="hidden" name={'tags.' + i} value={tag}/>
                                    ))}
                                    <InputError message={errors.tags}/>
                                </Field>
                            </FieldSet>
                            <Field>
                                <Button type="submit">{t('common:save_changes')}</Button>
                                <InputError className="text-green-700"
                                            message={updateSuccessMessage === 'tags' ? t('common:changes_saved') : undefined}/>
                            </Field>
                        </FieldGroup>
                    )}
                </Form>

                <Separator/>

                <Form
                    {...ProjectController.updateLocation.form(project.slug)}
                    className="w-full"
                    onSuccess={() => setUpdateSuccessMessage('location')}
                >
                    {({errors}) => (
                        <FieldGroup>
                            <LocationSearch
                                legend={t('project_form_location_title')}
                                initialPlace={project.place}
                                errors={errors}
                            />
                            <Field>
                                <Button type="submit">{t('common:save_changes')}</Button>
                                <InputError className="text-green-700"
                                            message={updateSuccessMessage === 'location' ? t('common:changes_saved') : undefined}/>
                            </Field>
                        </FieldGroup>
                    )}
                </Form>

                <Separator/>

                <section>
                    <h2 className="section-title">
                        {t('project_handle_members')}
                    </h2>
                    <ul className="flex flex-col gap-2">
                        {project.members.map((member) => (
                            <li key={member.id}>
                                <Item variant="outline" size="sm">
                                    <Avatar>
                                        <AvatarImage
                                            src={useImageAsset('users/' + member.avatar + '/small')}
                                            alt={member.nickname}
                                        />
                                    </Avatar>
                                    <ItemContent>
                                        <ItemTitle>
                                            {member.nickname}
                                        </ItemTitle>
                                        <ItemDescription>
                                            {member.first_name} {member.last_name}
                                        </ItemDescription>
                                    </ItemContent>
                                    <ItemActions>
                                        <Button asChild
                                                size="icon"
                                                variant="ghost"
                                        >
                                            <Link href={showProfile(member.id).url}>
                                             <span className="sr-only">
                                                 {t('common:to_user_profile',{user:member.nickname})}
                                             </span>
                                                <SquareArrowOutUpRight/>
                                            </Link>
                                        </Button>
                                        <Button
                                                size="icon"
                                                variant="ghost"
                                        >
                                             <span className="sr-only">
                                                 {t('project:manage_user',{user:member.nickname})}
                                             </span>
                                            <EllipsisVertical/>
                                        </Button>
                                    </ItemActions>
                                    <ItemFooter>
                                        {/* TODO add colors for roles? */}
                                        <Badge>
                                            {t('role_' + member.role)}
                                        </Badge>
                                    </ItemFooter>
                                </Item>
                            </li>
                        ))}
                    </ul>
                </section>

                {canManageInvitations && (
                    <>
                        <Separator/>

                        <section>
                            <h2 className="section-title">
                                {t('invitation_manage_title')}
                            </h2>
                            {project.invitations.length === 0 ? (
                                <p>{t('invitation_none')}</p>
                            ) : (
                                <ul className="flex flex-col gap-2">
                                    {project.invitations.map((invitation) => (
                                        <li key={invitation.id}>
                                            <Item variant="outline" size="sm">
                                                <ItemContent>
                                                    <ItemTitle>
                                                        {invitation.code}
                                                    </ItemTitle>
                                                    <ItemDescription>
                                                        {invitation.expires_at
                                                            ? upcomingDateToString(laravelDateToJsDate(invitation.expires_at))
                                                            : t('invitation_no_expiry')}
                                                        {' · '}
                                                        {t('invitation_uses_display', {
                                                            used: invitation.used_count,
                                                            max: invitation.max_uses ?? '∞',
                                                        })}
                                                    </ItemDescription>
                                                </ItemContent>
                                                <ItemActions>
                                                    {invitation.is_valid && (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => setRevokeTarget(invitation)}
                                                        >
                                                            <span className="sr-only">
                                                                {t('invitation_revoke_action')}
                                                            </span>
                                                            <Trash2/>
                                                        </Button>
                                                    )}
                                                </ItemActions>
                                                <ItemFooter>
                                                    <Badge variant={invitation.is_valid ? 'default' : 'destructive'}>
                                                        {t(invitation.is_valid ? 'invitation_status_valid' : 'invitation_status_revoked')}
                                                    </Badge>
                                                </ItemFooter>
                                            </Item>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </>
                )}

            <ConfirmModal
                id="invitation-confirm-revoke"
                showModal={revokeTarget !== null}
                onClose={() => setRevokeTarget(null)}
                onSuccess={() => setRevokeTarget(null)}
                formAction={revokeTarget ? ProjectInvitationController.revoke.form([project.slug, revokeTarget.id]) : undefined}
                title={t('invitation_revoke_title')}
                message={revokeTarget ? t('invitation_revoke_warning', {code: revokeTarget.code}) : null}
            />
        </Layout>
    );
}

import Layout from '@/layouts/app-layout'
import ProjectSettingsLayout from '@/layouts/projects/settings-layout'
import {Head, usePage} from '@inertiajs/react'
import ProjectController from "@/actions/App/Http/Controllers/ProjectController";
import ProjectInvitationController from "@/actions/App/Http/Controllers/ProjectInvitationController";
import {IMember, IProjectInvitation, IProjectSettings} from "@/types";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Trash2} from "lucide-react";
import {Item, ItemContent, ItemDescription, ItemTitle, ItemFooter, ItemActions} from "@/components/ui/item";
import {Badge} from "@/components/ui/badge";
import {useState} from "react";
import ConfirmModal from "@/components/modals/confirm-modal";
import MemberItem from "@/components/projects/member-item";
import {laravelDateToJsDate, upcomingDateToString} from "@/helpers/date";

type PageProps = {
    project: IProjectSettings;
}

export default function ProjectSettingsMembers({}) {
    const {t} = useTranslation(['projects', 'common']);
    const {t: tDate} = useTranslation('date');
    const {project} = usePage<PageProps>().props;

    const [revokeTarget, setRevokeTarget] = useState<IProjectInvitation | null>(null);
    const [banTarget, setBanTarget] = useState<IMember | null>(null);
    const canManageInvitations = project.user_role === 'admin' || project.user_role === 'moderator';

    return (
        <Layout className="px-3">
            <Head title={t('project_settings_members_title')}/>
            <ProjectSettingsLayout project={project}>
                <section>
                    <h2 className="section-title">
                        {t('project_handle_members')}
                    </h2>
                    <ul className="flex flex-col gap-2">
                        {project.members.map((member) => (
                            <li key={member.uuid}>
                                <MemberItem
                                    projectSlug={project.slug}
                                    member={member}
                                    onBan={setBanTarget}
                                />
                            </li>
                        ))}
                    </ul>
                </section>

                {project.banned_members.length > 0 && (
                    <>
                        <Separator/>

                        <section>
                            <h2 className="section-title">
                                {t('project_handle_banned_members')}
                            </h2>
                            <ul className="flex flex-col gap-2">
                                {project.banned_members.map((member) => (
                                    <li key={member.uuid}>
                                        <MemberItem
                                            projectSlug={project.slug}
                                            member={member}
                                            onBan={setBanTarget}
                                            showBanAction={false}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </>
                )}

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
                                                            ? upcomingDateToString(laravelDateToJsDate(invitation.expires_at), tDate)
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

                <ConfirmModal
                    id="member-confirm-ban"
                    showModal={banTarget !== null}
                    onClose={() => setBanTarget(null)}
                    onSuccess={() => setBanTarget(null)}
                    formAction={banTarget ? ProjectController.banMember.form(project.slug) : undefined}
                    fields={banTarget ? {user_uuid: banTarget.uuid} : undefined}
                    title={t('member_ban_title')}
                    message={banTarget ? t('member_ban_warning', {user: banTarget.nickname}) : null}
                />
            </ProjectSettingsLayout>
        </Layout>
    );
}

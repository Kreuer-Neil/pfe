import {Link, router} from '@inertiajs/react'
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {EllipsisVertical, SquareArrowOutUpRight} from "lucide-react";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {Item, ItemContent, ItemDescription, ItemTitle, ItemFooter, ItemActions} from "@/components/ui/item";
import {Badge} from "@/components/ui/badge";
import {useImageAsset} from "@/hooks/use-image-asset";
import {show as showProfile} from '@/actions/App/Http/Controllers/UserProfileController'
import ProjectController from "@/actions/App/Http/Controllers/ProjectController";
import {IMember} from "@/types";

type MemberItemProps = {
    projectSlug: string;
    member: IMember;
    onBan: (member: IMember) => void;
    showBanAction?: boolean;
}

export default function MemberItem({projectSlug, member, onBan, showBanAction = true}: MemberItemProps) {
    const {t} = useTranslation(['projects', 'common']);

    return (
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
                    <Link href={showProfile(member.uuid).url}>
                     <span className="sr-only">
                         {t('common:to_user_profile', {user: member.nickname})}
                     </span>
                        <SquareArrowOutUpRight/>
                    </Link>
                </Button>
                {member.manageable && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                            >
                                 <span className="sr-only">
                                     {t('manage_user', {user: member.nickname})}
                                 </span>
                                <EllipsisVertical/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('member_change_role')}</DropdownMenuLabel>
                            {member.assignable_roles.map((role) => (
                                <DropdownMenuItem
                                    key={role}
                                    onClick={() => router.patch(
                                        ProjectController.updateMemberRole.url(projectSlug),
                                        {user_uuid: member.uuid, role},
                                        {preserveScroll: true}
                                    )}
                                >
                                    {t('role_' + role)}
                                </DropdownMenuItem>
                            ))}
                            {showBanAction && (
                                <>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem
                                        variant="destructive"
                                        onClick={() => onBan(member)}
                                    >
                                        {t('member_ban_action')}
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </ItemActions>
            <ItemFooter>
                {/* TODO add colors for roles? */}
                <Badge variant={member.role === 'banned' ? 'destructive' : 'default'}>
                    {t('role_' + member.role)}
                </Badge>
            </ItemFooter>
        </Item>
    );
}
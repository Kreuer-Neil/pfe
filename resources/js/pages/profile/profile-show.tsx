import {Form, Head, router, usePage} from '@inertiajs/react'
import {IAppHeaderContext, IProfile} from "@/types";
import {useImageAsset} from "@/hooks/use-image-asset";
import PageFlowContainer from "@/components/page-flow-container";
import {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import AppLayout from "@/layouts/app-layout";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Field} from "@/components/ui/field";
import {Camera, Dot, Flag, Share2, UserMinus, UserPen, UserPlus} from "lucide-react";
import UserProfileController from "@/actions/App/Http/Controllers/UserProfileController";
import InputError from "@/components/input-error";

type PageProps = {
    user: IProfile;
    canEdit: boolean;
}

function ProfileIcon({isEditing, user, avatarError}: {
    isEditing: boolean,
    user: IProfile,
    avatarError: string
}): ReactNode {
    const {t} = useTranslation('profile');

    const [localFilePath, setLocalFilePath] = useState<string | undefined>(undefined);
    const iconPath = localFilePath ?? useImageAsset('users/' + user.avatar + '/large');

    if (!isEditing) {
        return <img
            alt={user.nickname} src={useImageAsset(`users/${user.avatar}/large`)}
            className="-my-14 ml-3 mr-auto size-28 bg-secondary rounded-full"
        />
    }

    return (
        <>
            <label htmlFor="avatar"
                   className="-mt-14 block ml-3 mr-auto w-fit cursor-pointer bg-secondary rounded-full -mb-6">
                <span className="sr-only">{t('field_avatar')}</span>

                <img src={iconPath} alt={user.nickname}
                     className="size-28 rounded-full object-cover"/>

                <Camera className="bg-background text-secondary-border rounded-full ml-auto p-1 -mt-8 -mr-2 z-10"/>
                <input type="file" accept="image/png, image/jpg, image/jpeg, image/webp, image/gif" name="avatar"
                       id="avatar"
                       className="image-input sr-only"
                       onChange={(e) => {
                           if (e.target.files && e.target.files[0]) {
                               setLocalFilePath(URL.createObjectURL(e.target.files[0]));
                           }
                       }}/>
            </label>
            <InputError className="mt-6 mx-3" message={avatarError}/>
        </>
    );
}

function ProfileContainer({id, isEditing, setIsEditing, className, children}: {
    id: string,
    isEditing: boolean,
    setIsEditing: Dispatch<SetStateAction<boolean>>
    className: string,
    children: ReactNode | ReactNode[] | ((errors: Record<string, string>) => ReactNode | ReactNode[]),
}) {
    if (isEditing) {
        return (
            <Form
                {...UserProfileController.update.form(id)}
                disableWhileProcessing
                encType="multipart/form-data"
                className={className}
                onSuccess={() => setIsEditing(false)}
            >
                {({processing, errors}) => (
                    <>
                        {typeof children === 'function' ? children(errors) : children}
                    </>
                )}
            </Form>
        );
    }
    return (
        <div className={className}>
            {typeof children === 'function' ? children({}) : children}
        </div>
    );
}

export default function profileShow({}) {
    const {t} = useTranslation('profile');
    const {user, canEdit} = usePage<PageProps>().props;

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [nickname, setNickname] = useState<string>(user.nickname);
    const [pronouns, setPronouns] = useState<string>(user?.pronouns ?? '');
    const [bio, setBio] = useState<string>(user.bio ?? '');

    const appHeaderContext: IAppHeaderContext = {
        contextImageSrc: useImageAsset(`users/${user.avatar}/medium`),
        context: t('user_context_profile', {user: user.nickname}),
    }

    return (
        <AppLayout appHeaderContext={appHeaderContext}>
            <Head title="show"/>
            <PageFlowContainer className="py-0">

                <ProfileContainer id={user.id} isEditing={isEditing}
                                  className="w-full flex flex-col gap-3 max-w-xl bg-card pb-4 -mb-4 border-b border-border"
                                  setIsEditing={setIsEditing}
                >
                    {(errors) => (
                        <>
                            <div className="w-full">
                                <div className="aspect-[2.8] w-full bg-container"/>
                                <ProfileIcon isEditing={isEditing} user={user} avatarError={errors?.avatar}/>
                            </div>
                            <div className="px-3 flex flex-col gap-3">
                                {!isEditing &&
                                    <div className="flex gap-1 justify-end -mb-3">
                                        {/* TODO add user as contact & other features */}
                                        {canEdit ?
                                            <Button size="sm" variant="outline" type="button"
                                                    onClick={() => setIsEditing(true)}
                                            >
                                                {t('user_edit')}<UserPen/>
                                            </Button>
                                            :
                                            user?.is_following ?
                                                <Form
                                                    {...UserProfileController.unfollow.form(user.id)}
                                                >
                                                    <Button size="sm" variant="outline">
                                                        {t('user_remove')}<UserMinus/>
                                                    </Button>
                                                </Form> :
                                                <Form
                                                    {...UserProfileController.follow.form(user.id)}
                                                >
                                                    <Button size="sm" variant="outline">
                                                        {t('user_add')}<UserPlus/>
                                                    </Button>
                                                </Form>
                                        }
                                        {/*<Button size="icon-sm" variant="outline">
                                        <span className="sr-only">{t('common:share')}</span><Share2/>
                                    </Button>*/}
                                        {/*{!canEdit &&
                                        <Button size="icon-sm" variant="outline">
                                            <span className="sr-only">{t('common:button_report')}</span><Flag/>
                                        </Button>}*/}
                                    </div>}
                                <div className="mt-4">
                                    {isEditing ? (
                                        <Field className="mb-3">
                                            <Label htmlFor="nickname">{t('field_nickname')}</Label>
                                            <Input name="nickname" id="nickname" required value={nickname}
                                                   onChange={(e) => setNickname(e.target.value)}
                                                   className="page-title w-full"/>
                                            <InputError message={errors.nickname}/>
                                        </Field>
                                    ) : (
                                        <h1 className="page-title">{user.nickname}</h1>
                                    )}
                                    {!isEditing && <p className="flex w-full">
                                        <span>{user.first_name + ' ' + user.last_name}</span>
                                        {user?.pronouns &&
                                            <>
                                                <Dot/>
                                                <span title={t('pronouns')}>{user.pronouns}</span>
                                            </>
                                        }
                                    </p>}
                                    {isEditing && (
                                        <Field>
                                            <Label htmlFor="pronouns">{t('field_pronouns')}</Label>
                                            <Input name="pronouns" id="pronouns" value={pronouns}
                                                   onChange={(e) => setPronouns(e.target.value)}/>
                                            <InputError message={errors.pronouns}/>
                                        </Field>
                                    )}
                                </div>
                                {isEditing ? (
                                    <Field>
                                        <Label htmlFor="bio">{t('field_bio')}</Label>
                                        <Textarea name="bio" id="bio" value={bio}
                                                  onChange={(e) => setBio(e.target.value)}
                                                  className="w-full"/>
                                        <InputError message={errors.bio}/>
                                    </Field>
                                ) : user?.bio && (
                                    <p>{user.bio}</p>
                                )}
                                {isEditing &&
                                    <Button type="submit" className="self-center">
                                        {t('submit_profile_changes')}
                                    </Button>}
                            </div>
                        </>
                    )}
                </ProfileContainer>
            </PageFlowContainer>
        </AppLayout>
    )
}

import {Form, Head, router, usePage} from '@inertiajs/react'
import {IAppHeaderContext, IProfile, IUser, SharedData} from "@/types";
import {useImageAsset} from "@/hooks/use-image-asset";
import PageFlowContainer from "@/components/page-flow-container";
import {ReactNode, useState} from "react";
import AppLayout from "@/layouts/app-layout";
import {useTranslation} from "react-i18next";
import IconButton from "@/components/buttons/icon-button";
import {Camera, Dot, Flag, Share2, UserPen, UserPlus} from "lucide-react";
import UserProfileController from "@/actions/App/Http/Controllers/UserProfileController";
import GeneralInput from "@/components/form/general-input";
import Button from "@/components/buttons/button";

type PageProps = {
    user: IProfile;
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
            className="-my-14 ml-3 mr-auto size-[7rem] bg-secondary rounded-full"
        />
    }

    return (
        <>
            <label htmlFor="avatar"
                   className="-mt-14 block ml-3 mr-auto w-fit cursor-pointer bg-secondary rounded-full -mb-6">
                <span className="sr-only">{t('field_avatar')}</span>

                <img src={iconPath} alt={user.nickname}
                     className="size-[7rem] rounded-full object-cover"/>

                <Camera className="bg-background text-secondary-border rounded-full ml-auto p-1 -mt-8 -mr-2 z-10"/>
                <input type="file" accept="image/png, image/jpg, image/webp" name="avatar" id="avatar"
                       className="image-input sr-only"
                       onChange={(e) => {
                           if (e.target.files && e.target.files[0]) {
                               setLocalFilePath(URL.createObjectURL(e.target.files[0]));
                           }
                       }}/>
            </label>
            {avatarError &&
                <span className="field-error">{avatarError}</span>}
        </>
    );
}

function ProfileContainer({id, isEditing, className, children}: {
    id: string,
    isEditing: boolean,
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
            {/* @ts-ignore */}
            {typeof children === 'function' ? children() : children}
        </div>
    );
}

export default function profileShow({}) {
    const {t} = useTranslation('profile');
    const {user} = usePage<PageProps>().props;
    const {auth} = usePage<SharedData>().props;

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const isCurrentUser: boolean = Number(user.id) === auth.user.id;

    const [nickname, setNickname] = useState<string>(user.nickname);
    const [pronouns, setPronouns] = useState<string>(user?.pronouns ?? '');
    const [bio, setBio] = useState<string>(user.bio ?? '');

    router.on('flash', (e) => {
        if (e.detail.flash.success) {
            setIsEditing(false);
        }
    });

    const appHeaderContext: IAppHeaderContext = {
        contextImageSrc: useImageAsset(`users/${user.avatar}/medium`),
        context: t('user_context_profile', {user: user.nickname}),
    }

    return (
        <AppLayout appHeaderContext={appHeaderContext}>
            <Head title="show"/>
            <ProfileContainer id={user.id} isEditing={isEditing}
                              className="w-full flex flex-col gap-3 max-w-xl">
                {(errors) => (
                    <>
                        <div className="w-full">
                            <div className="aspect-[2.8] w-full bg-container"/>
                            <ProfileIcon isEditing={isEditing} user={user} avatarError={errors?.avatar}/>
                        </div>
                        <div className="px-3 flex flex-col gap-3">
                            {!isEditing &&
                                <div className="flex gap-1 justify-end -mb-3">
                                    {isCurrentUser ?
                                        <IconButton icon={UserPen} textContent={t('user_edit')}
                                                    showText={true} onClick={() => setIsEditing(true)}/>
                                        : <IconButton icon={UserPlus} textContent={t('user_add')}
                                                      showText={true}/>}
                                    <IconButton icon={Share2} textContent={t('common:share')}/>
                                    {!isCurrentUser &&
                                        <IconButton icon={Flag} textContent={t('common:button_report')}/>}
                                </div>}
                            <div className="mt-4">
                                <h1 className="page-title">{isEditing ?
                                    <GeneralInput name="nickname" label={t('field_nickname')}
                                                  required={true}
                                                  className="mb-3 normal-text" inputClassName="w-full page-title"
                                                  value={nickname} setValue={setNickname}/>
                                    : user.nickname
                                }</h1>
                                {!isEditing && <p className="flex w-full">
                                    <span>{user.first_name + ' ' + user.last_name}</span>
                                    {user?.pronouns &&
                                        <>
                                            <Dot/>
                                            <span title={t('pronouns')}>{user.pronouns}</span>
                                        </>
                                    }
                                </p>}
                                {isEditing &&
                                    <GeneralInput name="pronouns" label={t('field_pronouns')}
                                                  value={pronouns} setValue={setPronouns}/>}
                            </div>
                            {isEditing ?
                                <GeneralInput name="bio" label={t('field_bio')} value={bio} setValue={setBio}
                                              type="textarea" inputClassName="w-full"/>
                                : user?.bio &&
                                <p>{user.bio}</p>
                            }
                            {isEditing &&
                                <Button textContent={t('submit_profile_changes')} type="submit" onClick={() => null}/>}
                        </div>
                    </>
                )}
            </ProfileContainer>
            {/*<div className="flex flex-col-reverse items-center">

                    <h1 className="page-title">{user.nickname}</h1>

                </div>

                <label htmlFor="profile-picture">
                    <span className="sr-only">t('profile_picture')</span>
                    <input type="file" id="profile-picture" name="profile-picture"
                           accept="image/png, image/jpg, image/webp"
                           onChange={(e) => {
                               if (e.target.files && e.target.files[0]) {
                                   setLocalFilePath(URL.createObjectURL(e.target.files[0]));
                               }
                           }}/>
                </label>*/}
        </AppLayout>
    )
}

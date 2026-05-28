import Layout from '@/layouts/app-layout'
import {Head, usePage} from '@inertiajs/react'
import type {IProfile, IUser, SharedData} from "@/types";
import {useImageAsset} from "@/hooks/use-image-asset";
import PageFlowContainer from "@/components/page-flow-container";
import {useState} from "react";

type PageProps = {
    user: IProfile;
}

export default function profileShow({}) {
    const {user} = usePage<PageProps>().props;

    const [avatar, setAvatar] = useState<string>('');

    return (
        <Layout>
            <Head title="show"/>
            <PageFlowContainer>

                <div className="flex flex-col-reverse items-center">

                    <h1 className="page-title">{user.nickname}</h1>
                    <img width="64px" height="64px" src={(avatar.length>0 ?avatar :useImageAsset(`users/${user.avatar}/large`))}
                         alt={user.nickname + 'profile picture'} className="bg-loading size-16"/>
                </div>

                <label htmlFor="profile-picture">
                    <span className="sr-only">t('profile_picture')</span>
                    <input type="file" id="profile-picture" name="profile-picture"
                           accept="image/png, image/svg, image/svg" value={avatar}
                           onChange={(e) => setAvatar(e.currentTarget.value)}/>
                </label>

            </PageFlowContainer>
        </Layout>
    )
}

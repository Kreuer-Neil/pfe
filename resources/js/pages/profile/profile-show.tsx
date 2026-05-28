import Layout from '@/layouts/app-layout'
import {Head, usePage} from '@inertiajs/react'
import type {IProfile, IUser, SharedData} from "@/types";
import {useImageAsset} from "@/hooks/use-image-asset";
import PageFlowContainer from "@/components/page-flow-container";

type PageProps = {
    user: IProfile;
}

export default function profileShow({}) {
    const {user} = usePage<PageProps>().props;

    return (
        <Layout>
            <Head title="show"/>
            <PageFlowContainer>

                <div className="flex flex-col-reverse items-center">

                <h1 className="page-title">{user.nickname}</h1>
                <img width="64px" height="64px" src={useImageAsset(`users/${user.avatar}/large`)}
                     alt={user.nickname + 'profile picture'} className="bg-loading size-16"/>
                </div>

                <label htmlFor="profile-picture">
                    <span className="sr-only">t('profile_picture')</span>
                    <input type="image" width="64px" height="64px" id="profile-picture" name="profile-picture" alt=""/>
                </label>

            </PageFlowContainer>
        </Layout>
    )
}

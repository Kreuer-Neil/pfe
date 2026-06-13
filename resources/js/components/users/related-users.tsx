import {IProfile} from "@/types";
import {ReactNode} from "react";
import {useImageAsset} from "@/hooks/use-image-asset";

function UserAvatar({user}: { user: IProfile }) {
    return (
        <img src={useImageAsset(`users/${user.avatar}/small`)} alt={user.nickname}
             srcSet={`${useImageAsset(`users/${user.avatar}/medium`)} 2x, ${useImageAsset(`users/${user.avatar}/large`)} 3x, `}
             className="size-8 border border-secondary-border rounded-full bg-loading"/>
    );
}

export default function RelatedUsers({profiles}: { profiles: IProfile[] | null }): ReactNode | null {
    if (!(profiles?.length && profiles.length !== 0)) {
        return null;
    }

    return (
        <ul className="flex pr-4">
            {profiles.slice(0,3).map((profile:IProfile, index) => {
                return (
                    <li className={`-mr-4 z-${(index-3)*(-1)}0`} key={index}>
                        <UserAvatar user={profile}/>
                    </li>
                );
            })
            }
            {
                profiles.length > 3 &&
                <li className="size-8 border border-secondary-border rounded-full bg-loading flex items-center justify-end pr-1 text-secondary-border pl-1 -mr-4 text-xs">

                <p>
                    +{profiles.length - 3}
                </p>
                </li>
            }
        </ul>
    );
}

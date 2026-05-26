import {ReactNode} from "react";
import {IProfile} from "@/types";

function ProfileIcon({profile}: { profile: IProfile }) {
    return (
        <img src={'./assets/img/profiles/' + profile.image} alt={profile.nickname}/>
    );
}

export default function ProfileIcons({profiles, maxItems = 3n, className = ''}: {
    profiles: IProfile[],
    maxItems: bigint,
    className: string
}): ReactNode {


    let i = 0;
    return (
        <div>
            <ul>
                {profiles.map((profile: IProfile) => {
                    return (
                        <ProfileIcon profile={profile}/>
                    );
                })}
            </ul>

        </div>
    );
}

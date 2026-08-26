import {IProfile} from "@/types";
import {ReactNode} from "react";
import {Link} from "@inertiajs/react";
import {show as showProfile} from "@/actions/App/Http/Controllers/UserProfileController"
import UserAvatar from "@/components/users/user-avatar";


function LinkContainer({profile, isWithLinks, children}: {
    profile: IProfile,
    isWithLinks: boolean,
    children: ReactNode
}) {
    if (isWithLinks) {
        return (
            <Link href={showProfile(profile.uuid)}>
                {children}
            </Link>
        );
    } else return children;
}

export default function RelatedUsers({profiles, isWithLinks = false}: {
    profiles: IProfile[] | null,
    isWithLinks?: boolean
}): ReactNode | null {
    if (!(profiles?.length && profiles.length !== 0)) {
        return null;
    }

    return (
        <ul className="flex pr-4">
            {profiles.slice(0, 3).map((profile: IProfile, index) => {
                return (
                    <li className={`-mr-4 z-${(index - 3) * (-1)}0`} key={index}>
                        <LinkContainer profile={profile} isWithLinks={isWithLinks}>
                            <UserAvatar user={profile}/>
                        </LinkContainer>
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

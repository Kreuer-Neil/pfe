import {IProfile, IUser} from "@/types";
import {useImageAsset} from "@/hooks/use-image-asset";

export default function UserAvatar({user}: { user: IProfile|IUser }) {
    return (
        <img src={useImageAsset(`users/${user.avatar}/small`)} alt={user.nickname}
             srcSet={`${useImageAsset(`users/${user.avatar}/medium`)} 2x, ${useImageAsset(`users/${user.avatar}/large`)} 3x, `}
             className="size-8 shrink-0 border border-secondary-border rounded-full bg-loading object-cover"/>
    );
}

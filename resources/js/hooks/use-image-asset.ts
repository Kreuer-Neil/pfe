/**
 * To get an image's path. Use paths like `app/logo` and `projects/{project.icon}/small`
 */
export function useImageAsset(assetPath: string): string {
    const assetPathParts = assetPath.split('/');


    let directoryPath: string;
    switch (assetPathParts[0]) {
        case 'app':
            if (assetPathParts[1] === 'logo')
                return '/logo.svg';
            break;
        case 'projects':
            directoryPath = '/projects/';
            if (isUndefined(assetPathParts[1]))
                return '/icons/default_1.svg';
            break;
        case 'users':
            directoryPath = '/users/';
            if (isUndefined(assetPathParts[1]))
                return '/icons/default_user.svg'
            break;
        default:
            directoryPath = '/';
            break;
    }
    // @ts-ignore
    if (directoryPath)
        return directoryPath! + (assetPathParts[2] ? assetPathParts[2] + '/' : '') + assetPathParts[1];


    return '/icons/default_icon.svg';
}

function isUndefined($image: string) {
    return ['', 'undefined', 'null'].includes($image);
}

import {IProject, IProjectShow} from "@/types";


export function instanceOfProjectShow(object: any): object is IProjectShow {
    return object.user_role === 'viewer';
}

export function instanceOfProject(object: any): object is IProject {
    return object.user_role === 'member'
        || object.user_role === 'task_manager'
        || object.user_role === 'moderator'
        || object.user_role === 'admin';
}

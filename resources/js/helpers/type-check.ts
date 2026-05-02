import {IProject, IProjectShow} from "@/types";


export function instanceOfProjectShow(object: any): object is IProjectShow {
    return object.access === 'Viewer';
}

export function instanceOfProject(object: any): object is IProject {
    return object.access === 'Member'
        || object.access === 'Taskmaster'
        || object.access === 'Moderator'
        || object.access === 'Admin';
}

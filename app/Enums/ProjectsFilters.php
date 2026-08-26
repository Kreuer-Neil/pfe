<?php

namespace App\Enums;

enum ProjectsFilters: string
{
    case MY_PROJECTS = 'my_projects';
    case RECENT_PROJECTS = 'created_at';
    case CLOSE_PROJECTS = 'proximity';

    // TODO add a RELEVANCE case here (reusing Project::suggestedFor()'s tag/language/distance scoring)
}

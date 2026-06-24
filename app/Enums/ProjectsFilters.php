<?php

namespace App\Enums;

enum ProjectsFilters:string
{
    case MY_PROJECTS = 'my_projects';
    case RECENT_PROJECTS = 'created_at';
}

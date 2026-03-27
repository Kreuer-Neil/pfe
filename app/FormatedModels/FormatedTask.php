<?php

namespace App\FormatedModels;

use App\Models\User;

class FormatedTask
{
    public string $id;
    public ?User $owner;
    public string $title;
    public string $description;
    public string $project_id;
    public string $min_participations;
    public $participating_users;
    public bool $is_self_participating;
    // TODO swich to datetime
    public ?string $starting_at;
    public string $due_at;
    public string $created_at;
    public string $updated_at;

    public function __construct(
        $id,
        $owner,
        $title,
        $description,
        $project_id,
        $min_participations,
        $participating_users,
        $is_self_participating,
        $starting_at,
        $due_at,
        $created_at,
        $updated_at,
    )
    {
        $this->id = $id;
        $this->owner = $owner;
        $this->title = $title;
        $this->description = $description;
        $this->project_id = $project_id;
        $this->min_participations = $min_participations;
        $this->participating_users = $participating_users;
        $this->is_self_participating = $is_self_participating;
        $this->starting_at = $starting_at;
        $this->due_at = $due_at;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

}

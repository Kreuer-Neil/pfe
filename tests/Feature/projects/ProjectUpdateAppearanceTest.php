<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\patch;

function makeProjectWithMember(ProjectRole $role): array
{
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $user = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $user->id, 'role' => $role->value]);

    return [$project, $user];
}

test('an admin can update project appearance', function () {
    [$project, $admin] = makeProjectWithMember(ProjectRole::ADMIN);
    actingAs($admin);

    patch(route('projects.update.appearance', $project->slug), [
        'name' => 'Updated Name',
        'description' => 'Updated description.',
    ])->assertRedirect(route('projects.edit', $project->slug));

    $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => 'Updated Name']);
});

test('a moderator can also update project appearance', function () {
    [$project, $moderator] = makeProjectWithMember(ProjectRole::MODERATOR);
    actingAs($moderator);

    patch(route('projects.update.appearance', $project->slug), [
        'name' => 'Moderator Update',
        'description' => 'Updated description.',
    ])->assertRedirect();

    $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => 'Moderator Update']);
});

test('a plain member cannot update project appearance', function () {
    [$project, $member] = makeProjectWithMember(ProjectRole::MEMBER);
    actingAs($member);

    patch(route('projects.update.appearance', $project->slug), [
        'name' => 'Should Not Apply',
        'description' => 'Updated description.',
    ])->assertForbidden();

    $this->assertDatabaseMissing('projects', ['name' => 'Should Not Apply']);
});

test('a task manager cannot update project appearance', function () {
    [$project, $taskManager] = makeProjectWithMember(ProjectRole::TASK_MANAGER);
    actingAs($taskManager);

    patch(route('projects.update.appearance', $project->slug), [
        'name' => 'Should Not Apply',
        'description' => 'Updated description.',
    ])->assertForbidden();
});

test('name is required to update appearance', function () {
    [$project, $admin] = makeProjectWithMember(ProjectRole::ADMIN);
    actingAs($admin);

    patch(route('projects.update.appearance', $project->slug), [
        'description' => 'Updated description.',
    ])->assertSessionHasErrors('name');
});

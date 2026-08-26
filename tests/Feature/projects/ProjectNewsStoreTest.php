<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

function makeProjectWithMemberForNews(ProjectRole $role): array
{
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $user = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $user->id, 'role' => $role->value]);

    return [$project, $user];
}

test('an admin can post news for their project', function () {
    [$project, $admin] = makeProjectWithMemberForNews(ProjectRole::ADMIN);
    actingAs($admin);

    post(route('projects.news.store', $project->slug), [
        'title' => 'Big update',
        'text_content' => 'We shipped a new feature today.',
    ])->assertRedirect();

    $this->assertDatabaseHas('project_news', [
        'project_id' => $project->id,
        'user_id' => $admin->id,
        'title' => 'Big update',
    ]);
});

test('a moderator can also post news', function () {
    [$project, $moderator] = makeProjectWithMemberForNews(ProjectRole::MODERATOR);
    actingAs($moderator);

    post(route('projects.news.store', $project->slug), [
        'title' => 'Moderator update',
        'text_content' => 'Some content here.',
    ])->assertRedirect();

    $this->assertDatabaseHas('project_news', ['project_id' => $project->id, 'title' => 'Moderator update']);
});

test('a plain member cannot post news', function () {
    [$project, $member] = makeProjectWithMemberForNews(ProjectRole::MEMBER);
    actingAs($member);

    post(route('projects.news.store', $project->slug), [
        'title' => 'Should not apply',
        'text_content' => 'Some content here.',
    ])->assertForbidden();

    $this->assertDatabaseMissing('project_news', ['title' => 'Should not apply']);
});

test('a task manager cannot post news', function () {
    [$project, $taskManager] = makeProjectWithMemberForNews(ProjectRole::TASK_MANAGER);
    actingAs($taskManager);

    post(route('projects.news.store', $project->slug), [
        'title' => 'Should not apply',
        'text_content' => 'Some content here.',
    ])->assertForbidden();
});

test('a viewer cannot post news', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $viewer = User::factory()->create();
    actingAs($viewer);

    post(route('projects.news.store', $project->slug), [
        'title' => 'Should not apply',
        'text_content' => 'Some content here.',
    ])->assertForbidden();
});

test('title and text_content are required', function () {
    [$project, $admin] = makeProjectWithMemberForNews(ProjectRole::ADMIN);
    actingAs($admin);

    post(route('projects.news.store', $project->slug), [])
        ->assertSessionHasErrors(['title', 'text_content']);
});

<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskNote;
use App\Models\User;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->project = Project::factory()->create(['owner_id' => $this->owner->id, 'is_private' => false]);

    $this->task = Task::factory()->create([
        'project_id' => $this->project->id,
        'user_id' => $this->owner->id,
    ]);
});

test('a moderator can delete another member\'s task note', function () {
    $author = User::factory()->create();
    Member::create(['user_id' => $author->id, 'project_id' => $this->project->id, 'role' => ProjectRole::MEMBER]);
    $note = TaskNote::create(['task_id' => $this->task->id, 'user_id' => $author->id, 'content' => 'note']);

    $moderator = User::factory()->create();
    Member::create(['user_id' => $moderator->id, 'project_id' => $this->project->id, 'role' => ProjectRole::MODERATOR]);

    $this->actingAs($moderator)
        ->delete(route('tasks.notes.destroy', $note->id))
        ->assertRedirect();

    $this->assertSoftDeleted('task_notes', ['id' => $note->id]);
});

test('an admin can delete another member\'s task note', function () {
    $author = User::factory()->create();
    Member::create(['user_id' => $author->id, 'project_id' => $this->project->id, 'role' => ProjectRole::MEMBER]);
    $note = TaskNote::create(['task_id' => $this->task->id, 'user_id' => $author->id, 'content' => 'note']);

    $this->actingAs($this->owner)
        ->delete(route('tasks.notes.destroy', $note->id))
        ->assertRedirect();

    $this->assertSoftDeleted('task_notes', ['id' => $note->id]);
});

test('a plain member cannot delete another member\'s task note', function () {
    $author = User::factory()->create();
    Member::create(['user_id' => $author->id, 'project_id' => $this->project->id, 'role' => ProjectRole::MEMBER]);
    $note = TaskNote::create(['task_id' => $this->task->id, 'user_id' => $author->id, 'content' => 'note']);

    $otherMember = User::factory()->create();
    Member::create(['user_id' => $otherMember->id, 'project_id' => $this->project->id, 'role' => ProjectRole::MEMBER]);

    $this->actingAs($otherMember)
        ->delete(route('tasks.notes.destroy', $note->id))
        ->assertForbidden();

    $this->assertDatabaseHas('task_notes', ['id' => $note->id, 'deleted_at' => null]);
});

test('the note author can delete their own note as a plain member', function () {
    $author = User::factory()->create();
    Member::create(['user_id' => $author->id, 'project_id' => $this->project->id, 'role' => ProjectRole::MEMBER]);
    $note = TaskNote::create(['task_id' => $this->task->id, 'user_id' => $author->id, 'content' => 'note']);

    $this->actingAs($author)
        ->delete(route('tasks.notes.destroy', $note->id))
        ->assertRedirect();

    $this->assertSoftDeleted('task_notes', ['id' => $note->id]);
});

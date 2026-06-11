<?php

namespace Database\Seeders;

use App\Enums\Language;
use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;

class TestUserSeeder
{
    /**
     * Seed the Test User
     */
    public static function run(): void
    {
        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'password' => 'drowssap',
                'email_verified_at' => now(),

                'nickname' => 'Test User',
                'avatar' => 'test_user',
                'bio' => 'Hi! My name is John Doe, I’m literally a user reference for anyone using an app made by a dev with a minimum of culture. I’m the “John Smith” of the internet. This is basically an example profile, so there’s nothing to see here :>'
            ]
        );

        $projectUsers = User::factory(5)->create(
            ['email_verified_at' => now(),]
        );

        $sharedGardenProject = Project::create(
            [
                'owner_id' => $testUser->id,
                'name' => 'Sunshine Alley 22b',
                'description' => 'The group for Building 22b on Sunshine Alley. Our shared garden is soon to become a vegetable garden, and we\'re workin hard on it. So that we could dine together sometimes, nearly for free. Living already costs too much, at least mutual aid is free.',
                'icon' => 'project_default',
                'slug' => \Str::slug('Sunshine Alley 22b'),
                'coordinates' => '50.61126712133781, 5.510050323190294',
                'lang' => Language::ENGLISH,

                'is_private' => true,
            ]
        );

        Member::create([
            'project_id' => $sharedGardenProject->id,
            'user_id' => $testUser->id,
            'role' => ProjectRole::ADMIN,
        ]);

        foreach ($projectUsers as $user) {
            Member::create([
                'project_id' => $sharedGardenProject->id,
                'user_id' => $user->id,
                'role' => (!random_int(0, 1)) ? ProjectRole::MEMBER : ProjectRole::TASK_MANAGER,
            ]);
        }

        $sharedGardenProject->addTask(new Task([
            'title' => 'Water the plants',
            'user_id' => $testUser->id,
            'description' => 'The plants in our appartment\'s shared garden need constant watering and care, especially if it didn\'t rain.',
            'min_participations' => 8,
            'due_at' => Carbon::createFromDate('2026', '06', '23')
        ]), $testUser)->participate($testUser);

        foreach (Task::factory(5)->create([
            'user_id' => $testUser->id,
            'project_id' => $sharedGardenProject->id,
        ]) as $task) {
            $task->participate($testUser);
            $task->participate($projectUsers->random(1)->first());
            $task->participate($projectUsers->random(1)->first());
            $task->participate($projectUsers->random(1)->first());
        }
    }
}

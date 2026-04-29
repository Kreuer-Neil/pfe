<?php

namespace Database\Seeders;

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
    public static function run()
    {
        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'password' => 'password',
                'email_verified_at' => now(),

                'nickname' => 'Test User',
            ]
        );

        $sharedGardenProject = Project::create(
            [
                'owner_id' => $testUser->id,
                'name' => 'Sunshine Alley 22b',
                'description' => 'Building 22',
                'slug' => 'Building 22',

                'is_private' => true,
            ]
        );

        Member::create([
            'project_id' => $sharedGardenProject->id,
            'user_id' => $testUser->id,
            'role' => ProjectRole::ADMIN,
        ]);

        $sharedGardenProject->addTask(new Task([
            'title' => 'Water the plants',
            'user_id' => $testUser->id,
            'description' => 'The plants in our appartment’s shared garden need constant watering and care, especially if it didn’t rain.',
            'min_participations' => 8,
            'due_at' => Carbon::createFromDate('2026', '06', '23')
        ]), $testUser)->participate($testUser);

        foreach (Task::factory(5)->create([
            'user_id' => $testUser->id,
            'project_id' => $sharedGardenProject->id,
        ]) as $task) {
            $task->participate($testUser);
        }
    }
}

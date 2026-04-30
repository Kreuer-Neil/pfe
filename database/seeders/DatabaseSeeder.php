<?php

namespace Database\Seeders;

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        TestUserSeeder::run();

        // TODO convert to "real" users
        $randomUsers = User::factory(2)->create();

        foreach ($randomUsers as $user) {
            $project = Project::factory()->create([
                'owner_id' => $user->id,
                'is_private' => false,
            ]);
            Member::create([
                'user_id' => $user->id,
                'project_id' => $project->id,
                'role' => ProjectRole::ADMIN,
            ]);

            $project->addTask(
                new Task(
                    [
                        'title' => 'Task 1',
                        'description' => 'No one cares',
                        'min_participations' => 6,
                        'due_at' => Carbon::create(year: 2026, month: 07, day: 21),
                    ]
                ), $user
            );
            $project->addTask(new Task([
                'title' => 'Task 2',
                'description' => 'No one cares',
                'min_participations' => 6,
                'due_at' => Carbon::create(year: 2026, month: 07, day: 21),
            ]), $user);
        }


    }
}

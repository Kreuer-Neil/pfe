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
use Str;

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


        // New seeder

        $projectsData = [
            [
                'name' => 'Luigi\'s Garden',
                'is_private' => 'false',
                'description' => 'Luigi’s Garden is about maintaining sir Luigi’s mansion garden, an unofficial park in this choking city, open to anyone respectful enough.',
                'slug' => Str::slug('Luigi\'s Garden'),
//                'coordinates' => '50.61126712133781, 5.510050323190294',
                'owner' => [
                    'first_name' => 'Luigi',
                    'last_name' => 'Mario',
                    'nickname' => 'Sir Luigi',
                    'email' => 'luigi@mansion.it',
                ]
            ],
            [
                'name' => 'Silk Song Band',
                'is_private' => 'true',
                'description' => 'Eh Guarana Adida SHAW',
                'slug' => Str::slug('Silk Song Band'),
                'owner' => [
                    'first_name' => 'Hornet',
                    'last_name' => 'Silk',
                    'email' => 'hornet@teamcherry.com'
                ],
                'users' => [
                    [
                        'first_name' => 'Hollow',
                        'last_name' => 'Knight',
                        'nickname' => 'Little guy',
                        'email' => 'hollowknight@teamcherry.com'
                    ]
                ],
                'tasks' => [
                    [
                        'title' => 'The final concert',
                        'description' => 'Everyone, get ready for the concert! That\'s the day we ascend!',
                        'min_participations' => 6,
                        'due_at' => Carbon::create(year: 2026, month: 07, day: 21, hour: 17),
                    ]
                ],
            ],
        ];

        // TODO finish customized data seeder to replace factories
        foreach ($projectsData as $projectData) {
            $owner = '';
            if (array_key_exists('owner', $projectData)) {
                $owner = User::factory()->create($projectData['owner']);
            } else {
                $owner = User::factory()->create();
            }

            $project = Project::factory()->create($projectData);

            Member::create([
                'user_id' => $owner->id,
                'project_id' => $project->id,
                'role' => ProjectRole::ADMIN,
            ]);

            if (array_key_exists('users', $projectData))
                foreach ($projectData['users'] as $user) {
                    Member::create([
                        'user_id' => $user->id,
                        'project_id' => $project->id,
                        'role' => random_int(0, 1) ? ProjectRole::MEMBER : ProjectRole::TASK_MANAGER,
                    ]);
                }
        }
    }
}

<?php

namespace Database\Seeders;

use App\Enums\Language;
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


        $projectsData = [
            [
                'name' => 'Luigi\'s Garden',
                'is_private' => false,
                'description' => 'Luigi’s Garden is about maintaining sir Luigi’s mansion garden, an unofficial park in this choking city, open to anyone respectful enough.',
                'coordinates' => '50.61126712133781, 5.510050323190294',
                'lang'=> Language::ENGLISH,
                'owner' => [
                    'first_name' => 'Luigi',
                    'last_name' => 'Mario',
                    'nickname' => 'Sir Luigi',
                    'email' => 'luigi@mansion.it',
                ]
            ],
            [
                'name' => 'Silk Song Band',
                'is_private' => false,
                'description' => 'Eh Guarana Adida SHAW',
                'lang' => Language::JAPANESE,
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
            [
                'name' => 'Planter des arbres à Seraing',
                'is_private' => 'false',
                'description' => 'Replantons des arbres, pour un Seraing plus vert !',
                'lang' => Language::FRENCH,

                'tasks' => [
                    [
                        'title' => 'Planter sur le terrain vague',
                        'description' => 'Aller planter des arbres sur le terrain vague derrière la HEPL Seraing ! Il y a plein de place, et ils ne risquent pas de s’en servir !',
                        'min_participations' => 3,
                        'due_at' => Carbon::create(year: 2026, month: 07, day: 21, hour: 17),
                    ],
                    [
                        'title' => 'Planter sur la place',
                        'description' => 'Planter des arbres sur la place de Seraing',
                        'due_at' => Carbon::create(year: 2026, month: 06, day: 17, hour: 11)
                    ],
                    [
                        'title' => 'Planter à la gare',
                        'description' => 'Planter des arbres à la gare de Seraing',
                        'due_at' => Carbon::create(year: 2026, month: 06, day: 16, hour: 9)
                    ],
                    [
                        'title' => 'Planter dans l\'entrepôt abandonné',
                        'description' => 'Planter des arbres dans l\'entrepôt qui a brûlé à de Seraing',
                        'due_at' => Carbon::create(year: 2026, month: 06, day: 21, hour: 9)
                    ],
                ],
            ]


        ];

        foreach ($projectsData as $projectData) {
            if (array_key_exists('owner', $projectData)) {
                $owner = User::factory()->create($projectData['owner']);
            } else {
                $owner = User::factory()->create();
            }

            $projectArray = [
                'owner_id' => $owner->id,
                'name' => $projectData['name'],
                'slug'=> Str::slug($projectData['name']),
                'is_private' => $projectData['is_private'],
                'description' => $projectData['description'],
            ];

            $project = Project::create($projectArray);

            Member::create([
                'user_id' => $owner->id,
                'project_id' => $project->id,
                'role' => ProjectRole::ADMIN,
            ]);

            if (array_key_exists('users', $projectData)) {
                $users = [];
                foreach ($projectData['users'] as $user) {
                    User::factory()->create($user);
                }
            } else {
                $users = User::factory(5)->create();
            }

            foreach ($users as $user) {
                Member::create([
                    'user_id' => $user->id,
                    'project_id' => $project->id,
                    'role' => random_int(0, 1) ? ProjectRole::MEMBER : ProjectRole::TASK_MANAGER,
                ]);
                if (array_key_exists('tasks', $projectData)) {
                    $tasks = [];
                    foreach ($projectData['tasks'] as $task) {
                        $task['project_id'] = $project->id;
                        $tasks[] = Task::factory()->create($task);
                    }
                } else {
                    $tasks = Task::factory(5)->create();
                }

                foreach ($tasks as $task) {
                    foreach ($users->random(3) as $user) {
                        $task->participate($user);
                    }
                }
            }
        }

        Project::factory(10)->create(['is_private' => false]);
    }
}

<?php

namespace Database\Seeders;

use App\Enums\Language;
use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;

class CredentialsSeeder
{
    /**
     * Seed the teachers credentials
     */
    public static function run(): void
    {

        $users = [
            'wera' => User::create([
                'last_name' => 'Wera',
                'first_name' => 'Maude',
                'email' => 'maude.wera@example.test',
                'password' => '123password4',
            ]),
            'schreurs' => User::create([
                'last_name' => 'Schreurs',
                'first_name' => 'Daniel',
                'email' => 'schreurs.daniel@example.test',
                'password' => '123password4',
            ]),
        ];

        foreach ($users as $user) {
            $project = Project::create([
                'name' => $name = 'Projet de ' . $user->last_name,
                'description' => 'Projet créé afin que ' . $user->nickname . ' puisse tester l’application.',

                'lang' => Language::FRENCH,
                'owner_id' => $user->id,
                'slug' => \Str::slug($name),

                'is_private' => false,
            ]);

            Member::create([
                'user_id' => $user->id,
                'project_id' => $project->id,
            ]);

            $members = User::factory(10)->create();

            foreach ($members as $member) {
                $project->joinAsMember($member);
            }

            $task1 = Task::create([
                'title' => 'Créer une nouvelle tâche',
                'description' => 'Tentez donc de créer une tâche sur votre projet !',
                'due_at' => Carbon::create(year: 2026, month: 06, day: 18, hour: 16),
                'min_participations' => 1,
                'user_id' => $user->id,
                'project_id' => $project->id,
            ]);

            $tasks = Task::factory(15)->create([
                'user_id' => $members->first()->id,
                'project_id' => $project->id,
            ]);

            foreach ($tasks as $task) {
                foreach ($members->random(5) as $member) {
                    $task->participate($member);
                }
            }
        }

    }
}

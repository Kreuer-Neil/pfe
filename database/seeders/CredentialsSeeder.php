<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CredentialsSeeder extends Seeder
{
    /**
     * Seed the teachers credentials
     */
    public function run(): void
    {
        $users = [
            'wera' => User::create([
                'last_name' => 'Wera',
                'first_name' => 'Maud',
                'email' => 'maud.wera@example.test',
                'password' => '123password4',
                'nickname' => 'Wera Maud'
            ]),
            'schreurs' => User::create([
                'last_name' => 'Schreurs',
                'first_name' => 'Daniel',
                'email' => 'schreurs.daniel@example.test',
                'password' => '123password4',
                'nickname' => 'Schreurs Daniel'
            ]),
        ];

        $locations = [
            'wera' => Location::firstOrCreate(
                ['osm_id' => '1407195', 'osm_type' => 'relation'],
                [
                    'latitude' => '50.5900',
                    'longitude' => '5.8626',
                    'display_name' => 'Verviers, Liège, Wallonie, Belgique',
                    'name' => 'Verviers',
                    'type' => 'city',
                ]
            ),
            'schreurs' => Location::firstOrCreate(
                ['osm_id' => '1407196', 'osm_type' => 'relation'],
                [
                    'latitude' => '50.5192',
                    'longitude' => '5.2378',
                    'display_name' => 'Huy, Liège, Wallonie, Belgique',
                    'name' => 'Huy',
                    'type' => 'city',
                ]
            ),
        ];

        foreach ($users as $key => $user) {
            $project = Project::create([
                'name' => $name = 'Projet de ' . $user->last_name,
                'description' => 'Projet créé afin que ' . $user->nickname . ' puisse tester l’application.',

                'owner_id' => $user->id,
                'location_id' => $locations[$key]->id,

                'is_private' => false,
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

<?php

namespace Database\Seeders;

use App\Enums\Language;
use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Str;

class FillDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public static function run(): void
    {
        info('Seeding fill data...');

        $projectsData = [
            [
                'name' => 'Luigi\'s Garden',
                'is_private' => false,
                'description' => 'Luigi’s Garden is about maintaining sir Luigi’s mansion garden, an unofficial park in this choking city, open to anyone respectful enough.',
                'coordinates' => '50.61126712133781, 5.510050323190294',
                'lang' => Language::ENGLISH,
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
                    'nickname' => 'Hornet',
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
                'is_private' => false,
                'icon' => 'project_default',
                'description' => 'Rejoignez-nous pour reverdir Seraing ! Ce projet citoyen a pour but de replanter des arbres dans les espaces inutilisés et délaissés de la ville, afin d\'améliorer la qualité de l\'air, de lutter contre les îlots de chaleur urbains et de rendre notre ville plus agréable à vivre. Tout le monde peut participer, aucune expérience n\'est nécessaire — juste de la bonne volonté et l\'envie de faire quelque chose de concret pour notre environnement !',
                'lang' => Language::FRENCH,

                'tasks' => [
                    [
                        'title' => 'Planter sur le terrain vague',
                        'description' => 'Le terrain vague derrière la HEPL Seraing est un espace idéal pour accueillir de nouveaux arbres. Grand, peu fréquenté et sans usage prévu, il offre suffisamment de place pour planter une dizaine d\'arbres en toute tranquillité. Munissez-vous de gants et de bonnes chaussures, le matériel de plantation sera fourni sur place !',
                        'min_participations' => 5,
                        'due_at' => Carbon::create(year: 2026, month: 07, day: 21, hour: 17),
                    ],
                    [
                        'title' => 'Planter sur la place',
                        'description' => 'La place centrale de Seraing manque cruellement d\'ombre en été. Nous avons obtenu l\'accord de la commune pour y installer plusieurs arbres à feuilles caduques le long du côté nord de la place. Une action visible et durable qui profitera à tous les habitants et aux commerces alentour.',
                        'min_participations' => 4,
                        'due_at' => Carbon::create(year: 2026, month: 06, day: 20, hour: 11),
                    ],
                    [
                        'title' => 'Planter à la gare',
                        'description' => 'Les abords de la gare de Seraing sont minéraux et peu accueillants pour les voyageurs comme pour la faune locale. Nous allons planter des arbustes et de petits arbres le long du cheminement piéton principal. Un coup de vert bienvenu pour la première image que les visiteurs ont de notre ville !',
                        'min_participations' => 3,
                        'due_at' => Carbon::create(year: 2026, month: 06, day: 21, hour: 9),
                    ],
                    [
                        'title' => 'Planter dans l\'entrepôt abandonné',
                        'description' => 'L\'entrepôt sinistré au bord de la ville est une friche urbaine en attente de réaffectation. En attendant, nous allons y créer un petit espace boisé en bordure du terrain, en accord avec le propriétaire. Une manière de transformer un endroit triste en poumon vert temporaire pour le quartier.',
                        'min_participations' => 4,
                        'due_at' => Carbon::create(year: 2026, month: 06, day: 23, hour: 9),
                    ],
                    [
                        'title' => 'Préparer les trous de plantation au parc Léopold',
                        'description' => 'Avant la grande journée de plantation prévue fin juillet, nous devons préparer le terrain au parc Léopold : creuser les trous aux emplacements balisés, amender la terre avec du compost et installer les tuteurs. Un travail physique mais essentiel pour garantir la reprise des arbres !',
                        'min_participations' => 6,
                        'due_at' => Carbon::create(year: 2026, month: 07, day: 10, hour: 9),
                    ],
                    [
                        'title' => 'Distribution de jeunes pousses aux habitants',
                        'description' => 'Dans le cadre de notre action de sensibilisation, nous organisons une distribution gratuite de jeunes pousses (chêne, tilleul, érable) aux habitants de Seraing qui souhaitent planter un arbre dans leur jardin. Venez nous aider à accueillir les familles, expliquer les bons gestes de plantation et distribuer les plants avec leurs fiches conseils.',
                        'min_participations' => 3,
                        'due_at' => Carbon::create(year: 2026, month: 07, day: 5, hour: 10),
                    ],
                    [
                        'title' => 'Réunion de bilan et planification',
                        'description' => 'Point d\'étape pour faire le bilan des plantations réalisées, identifier les arbres qui ont besoin d\'un suivi, et planifier les prochaines actions du projet pour l\'automne. Tous les membres sont les bienvenus, c\'est aussi l\'occasion de partager vos retours et vos idées pour la suite !',
                        'due_at' => Carbon::create(year: 2026, month: 06, day: 25, hour: 18),
                    ],
                ],
            ],
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
                'slug' => Str::slug($projectData['name']),
                'is_private' => $projectData['is_private'],
                'description' => $projectData['description'],
                'icon' => $projectData['icon'] ?? 'default_'.random_int(1,2),
            ];

            $project = Project::create($projectArray);

            Member::create([
                'user_id' => $owner->id,
                'project_id' => $project->id,
                'role' => ProjectRole::ADMIN,
            ]);

            $users = [];
            if (array_key_exists('users', $projectData)) {
                foreach ($projectData['users'] as $user) {
                    $users[] = User::factory()->create($user);
                }
            } else {
                $users = User::factory(5)->create();
            }

            if (array_key_exists('tasks', $projectData)) {
                $tasks = [];
                foreach ($projectData['tasks'] as $task) {
                    $task['project_id'] = $project->id;
                    $tasks[] = Task::factory()->create($task);
                }
            } else {
                $tasks = Task::factory(5)->create();
            }

            foreach ($users as $user) {
                Member::create([
                    'user_id' => $user->id,
                    'project_id' => $project->id,
                    'role' => random_int(0, 1) ? ProjectRole::MEMBER : ProjectRole::TASK_MANAGER,
                ]);

                foreach ($tasks as $task) {
                    $task->participate($user);
                }
            }
        }


        $users = User::all();
        $projects = [];
        foreach ($users->random(10) as $user) {
            $projects[] = Project::factory()->create(['is_private' => false, 'owner_id' => $user->id]);
        }
        foreach ($projects as $project) {
            // Link owners to their projects
            Member::create([
                'user_id' => $project->owner->id,
                'project_id' => $project->id,
                'role' => ProjectRole::ADMIN,
            ]);

            foreach ($users->random(random_int(2, 10)) as $user) {
                if (!$project->members()->where('user_id', $user->id)->exists()) {
                    Member::create([
                        'user_id' => $user->id,
                        'project_id' => $project->id,
                    ]);
                }
            }
        }

        info('Fill data seeded.');
    }
}

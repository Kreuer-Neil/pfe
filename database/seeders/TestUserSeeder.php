<?php

namespace Database\Seeders;

use App\Enums\ProjectRole;
use App\Models\Location;
use App\Models\Member;
use App\Models\Project;
use App\Models\ProjectNews;
use App\Models\Tag;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TestUserSeeder extends Seeder
{
    /**
     * Seed the Test User
     */
    public function run(): void
    {
        // Same real place as Luigi's Garden in FillDataSeeder - dedupes to the same row either way.
        $liege = Location::firstOrCreate(
            ['osm_id' => '1407192', 'osm_type' => 'relation'],
            [
                'latitude' => '50.61126712133781',
                'longitude' => '5.510050323190294',
                'display_name' => 'Liège, Wallonie, Belgique',
                'name' => 'Liège',
                'type' => 'city',
            ]
        );

        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'password' => 'drowssap',
                'email_verified_at' => now(),

                'nickname' => 'Test User',
                'avatar' => 'test_user',
                'bio' => 'Hi! My name is John Doe, I’m literally a user reference for anyone using an app made by a dev with a minimum of culture. I’m the “John Smith” of the internet. This is basically an example profile, so there’s nothing to see here :>',
            ]
        );

        $projectUsers = User::factory(5)->create(
            ['email_verified_at' => now()]
        );

        $sharedGardenProject = Project::create(
            [
                'owner_id' => $testUser->id,
                'name' => 'Sunshine Alley 22b',
                'description' => 'The group for Building 22b on Sunshine Alley. Our shared garden is soon to become a vegetable garden, and we\'re workin hard on it. So that we could dine together sometimes, nearly for free. Living already costs too much, at least mutual aid is free.',
                'icon' => 'project_default',
                'location_id' => $liege->id,

                'is_private' => true,
            ]
        );

        foreach ($projectUsers as $user) {
            Member::create([
                'project_id' => $sharedGardenProject->id,
                'user_id' => $user->id,
                'role' => (! random_int(0, 1)) ? ProjectRole::MEMBER : ProjectRole::TASK_MANAGER,
            ]);
        }

        Task::create([
            'title' => 'Water the plants',
            'user_id' => $testUser->id,
            'project_id' => $sharedGardenProject->id,
            'description' => 'The plants in our apartment\'s shared garden need constant watering and care, especially if it didn\'t rain.',
            'min_participations' => 8,
            'due_at' => Carbon::createFromDate('2026', '06', '23'),
        ])->participate($testUser);

        foreach (Task::factory(5)->create([
            'user_id' => $testUser->id,
            'project_id' => $sharedGardenProject->id,
        ]) as $task) {
            $task->participate($testUser);
            $task->participate($projectUsers->random(1)->first());
            $task->participate($projectUsers->random(1)->first());
            $task->participate($projectUsers->random(1)->first());
        }

        $sharedGardenProject->tags()->sync(
            Tag::whereIn('name', ['gardening', 'plants', 'sustainability', 'cooking'])->pluck('id')
        );

        ProjectNews::create([
            'project_id' => $sharedGardenProject->id,
            'user_id' => $testUser->id,
            'title' => 'Welcome to the shared garden!',
            'text_content' => 'Hi everyone! I finally got around to clearing out the old flower beds behind building 22b. It\'s not much to look at yet, but it\'s ready for us to start turning it into a proper vegetable garden. If you\'ve got tools, gloves, or old seed packets lying around, bring them along - every little helps!',
        ]);

        ProjectNews::create([
            'project_id' => $sharedGardenProject->id,
            'user_id' => $projectUsers->random(1)->first()->id,
            'title' => 'Compost bin is up!',
            'text_content' => 'Put together a compost bin out of some old pallets this weekend, it\'s sitting in the back corner near the fence. Feel free to toss your vegetable scraps in there instead of the bin - free fertilizer for the tomatoes come summer.',
        ]);

        ProjectNews::create([
            'project_id' => $sharedGardenProject->id,
            'user_id' => $testUser->id,
            'title' => 'First seeds are in the ground',
            'text_content' => 'Tomatoes, carrots and a row of beans are planted, thanks to everyone who showed up to help this morning! Watering will need to happen every couple of days now, I\'ve put a schedule up on the door of the building so we can take turns. Once things start growing, let\'s talk about organizing that shared meal we keep mentioning.',
        ]);
    }
}

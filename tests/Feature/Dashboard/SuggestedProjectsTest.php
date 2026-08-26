<?php

use App\Enums\ProjectRole;
use App\Models\Language;
use App\Models\Location;
use App\Models\Member;
use App\Models\Project;
use App\Models\Tag;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('suggested projects rank by shared tags, language, and distance, and exclude private/joined ones', function () {
    $user = User::factory()->create();
    $owner = User::factory()->create();
    $this->actingAs($user);

    $tagA = Tag::first();
    $tagB = Tag::skip(1)->first();
    $english = Language::where('name', 'EN')->first();
    $french = Language::where('name', 'FR')->first();

    $userLocation = Location::factory()->create(['latitude' => 50.0, 'longitude' => 5.0]);
    $user->preferences->update(['location_id' => $userLocation->id]);
    $user->preferences->tags()->sync([$tagA->id, $tagB->id]);
    $user->preferences->languages()->sync([$english->id]);

    // Best match: shares both tags, same language, nearby.
    $bestMatch = Project::factory()->create([
        'owner_id' => $owner->id,
        'is_private' => false,
        'language_id' => $english->id,
        'location_id' => Location::factory()->create(['latitude' => 50.01, 'longitude' => 5.01])->id,
    ]);
    $bestMatch->tags()->sync([$tagA->id, $tagB->id]);

    // Weaker match: shares one tag, different language, far away.
    $weakMatch = Project::factory()->create([
        'owner_id' => $owner->id,
        'is_private' => false,
        'language_id' => $french->id,
        'location_id' => Location::factory()->create(['latitude' => 10.0, 'longitude' => 10.0])->id,
    ]);
    $weakMatch->tags()->sync([$tagA->id]);

    // Excluded: private project, even though its tags match perfectly.
    $private = Project::factory()->create([
        'owner_id' => $owner->id,
        'is_private' => true,
        'language_id' => $english->id,
    ]);
    $private->tags()->sync([$tagA->id, $tagB->id]);

    // Excluded: user is already a member.
    $joined = Project::factory()->create([
        'owner_id' => $owner->id,
        'is_private' => false,
        'language_id' => $english->id,
    ]);
    $joined->tags()->sync([$tagA->id, $tagB->id]);
    Member::create(['user_id' => $user->id, 'project_id' => $joined->id, 'role' => ProjectRole::MEMBER]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('suggestedProjects', 2)
            ->where('suggestedProjects.0.slug', $bestMatch->slug)
            ->where('suggestedProjects.1.slug', $weakMatch->slug)
        );
});
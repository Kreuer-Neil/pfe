<?php


use App\Enums\Language;
use App\Models\User;

test('landing pages can be accessed and contain translated strings', function () {

    // To check if locales work too. Should be done with Inertia testing.
    /*foreach (Languages::cases() as $locale) {
        Lang::setLocale($locale->value);*/

        $requestHomepage = $this->get(route('frontpage.index'));
        $requestPolicyPage = $this->get(route('frontpage.policy'));
        // TODO add all pages here

        $requestHomepage->assertStatus(200);
        $requestHomepage->assertSee(__('frontpage.home.header.title'));

        // Temporarily removed.
        // $requestPolicyPage->assertStatus(200);
//    }
});


test('contextual login/open app button changes accordingly', function () {
    $user = User::factory()->create();

    $request1 = $this->get(route('frontpage.index'));

    $request1->assertSee(__('frontpage.nav.login'));

    $this->actingAs($this->user = User::factory()->create());
    $request2 = $this->get(route('frontpage.index'));

    $request2->assertSee(__('frontpage.nav.app'));
});

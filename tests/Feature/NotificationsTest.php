<?php


use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()
//        ->hasNotifications(1)
//        ->hasProjects(1)
//        ->hasTasks(3)
        ->create();
    $this->actingAs($this->user);
});


/*test('users gets notified on their dashboard when a task is soon due and task notifications are active', function () {
});*/

// user gets notified when kicked/banned of a project
// user gets notified when task is due until 24h+ or when they check it out

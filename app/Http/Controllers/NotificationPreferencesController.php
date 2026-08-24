<?php

namespace App\Http\Controllers;

use App\Enums\NotificationType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationPreferencesController extends Controller
{
    public function edit(Request $request)
    {
        $existing = $request->user()->notificationPreferences()->pluck('email_enabled', 'type');

        $preferences = collect(NotificationType::cases())->map(fn (NotificationType $type) => [
            'type' => $type->value,
            'email_enabled' => $existing->get($type->value, true),
        ]);

        return Inertia::render('settings/notifications', [
            'preferences' => $preferences,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'preferences' => 'required|array',
            'preferences.*.type' => 'required|string|in:'.implode(',', array_column(NotificationType::cases(), 'value')),
            'preferences.*.email_enabled' => 'required|boolean',
        ]);

        foreach ($validated['preferences'] as $preference) {
            $request->user()->notificationPreferences()->updateOrCreate(
                ['type' => $preference['type']],
                ['email_enabled' => $preference['email_enabled']],
            );
        }

        return redirect()->back();
    }
}

<?php

namespace App\Http\Controllers;

use App\Enums\ContactSubject;
use App\Mail\ContactFormSubmitted;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Enum;

class ContactFormController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => ['required', new Enum(ContactSubject::class)],
            'message' => 'required|string|max:5000',
        ]);

        Mail::to(config('mail.from.address'))->send(new ContactFormSubmitted(
            name: $validated['name'],
            email: $validated['email'],
            contactSubject: ContactSubject::from($validated['subject']),
            messageBody: $validated['message'],
        ));

        return back()->with('success', true);
    }
}

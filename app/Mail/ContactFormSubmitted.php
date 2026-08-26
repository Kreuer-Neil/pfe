<?php

namespace App\Mail;

use App\Enums\ContactSubject;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactFormSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string         $name,
        public string         $email,
        public ContactSubject $contactSubject,
        public string         $messageBody,
    )
    {
    }

    public function build(): self
    {
        return $this
            ->replyTo($this->email, $this->name)
            ->subject('New ' . $this->contactSubject->value . ' message from ' . $this->name)
            ->view('emails.contact-form');
    }
}

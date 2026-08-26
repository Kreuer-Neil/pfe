@php
    $defaultName = old('name', auth()->check() ? auth()->user()->first_name . ' ' . auth()->user()->last_name : '');
    $defaultEmail = old('email', auth()->user()->email ?? '');
    $requestedSubject = \App\Enums\ContactSubject::tryFrom((string) request()->query('type'));
    $defaultSubject = old('subject', $requestedSubject?->value);
@endphp
<x-layout.app :title="__('frontpage.contact.title')">
    <main>

        <div class="large-section mt-12">
            <h1>{!! __('frontpage.contact.title') !!}</h1>
            <p class="page-title text-center">{!! __('frontpage.contact.subtitle') !!}</p>
            <p>{!! __('frontpage.contact.bug_note') !!}</p>
        </div>

        <section>
            @if (session('success'))
                <p class="contact-success">{!! __('frontpage.contact.success') !!}</p>
            @endif

            <form method="POST" action="{{ route('frontpage.contact.store') }}" class="contact-form">
                @csrf

                <div class="contact-field">
                    <label for="contact-name">{!! __('frontpage.contact.field_name') !!}</label>
                    <input type="text" id="contact-name" name="name" class="input" required
                           value="{{ $defaultName }}">
                    @error('name')
                    <p class="field-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="contact-field">
                    <label for="contact-email">{!! __('frontpage.contact.field_email') !!}</label>
                    <input type="email" id="contact-email" name="email" class="input" required
                           value="{{ $defaultEmail }}">
                    @error('email')
                    <p class="field-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="contact-field">
                    <label for="contact-subject">{!! __('frontpage.contact.field_subject') !!}</label>
                    <select id="contact-subject" name="subject" class="input" required>
                        @if(!$defaultSubject)
                            <option selected>
                                {{ '— Select message type —' }}
                            </option>
                        @endif
                        @foreach (\App\Enums\ContactSubject::cases() as $subjectOption)
                            <option
                                value="{{ $subjectOption->value }}" @selected($defaultSubject === $subjectOption->value)>
                                {{ __('frontpage.contact.subjects.' . $subjectOption->value) }}
                            </option>
                        @endforeach
                    </select>
                    @error('subject')
                    <p class="field-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="contact-field">
                    <label for="contact-message">{!! __('frontpage.contact.field_message') !!}</label>
                    <textarea id="contact-message" name="message" class="input" rows="6"
                              required>{{ old('message') }}</textarea>
                    @error('message')
                    <p class="field-error">{{ $message }}</p>
                    @enderror
                </div>

                <button type="submit" class="btn self-center">{!! __('frontpage.contact.submit') !!}</button>
            </form>
        </section>

    </main>
</x-layout.app>

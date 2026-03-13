<?php
$navitemNames = [
    'index',
    'policy', // Or support, TODO see what tu put here
    'contact',
];
?>

<nav class="frontpage-nav">
    <h2 class="sr-only">{!! __('frontpage.nav.title') // TODO add nav title !!}</h2>
    <a href="{{ route('frontpage.index') }}">
        <img src="{{ asset('/logo.svg') }}" alt="{!! '' // TODO add logo (title) alt !!}">
    </a>
    <ul>
        @foreach($navitemNames as $navitemName)
            @php($navItemLang = __("frontpage.nav.{$navitemName}"))
            @php($navItemRoute = route("frontpage.{$navitemName}"))
            <li>
                <a href="{{ $navItemRoute }}"
                   title="{{ __('nav.alt',['name' => $navItemLang]) }}" {!! request()->routeIs('frontpage.'.$navitemName)?'class="active"':'' !!}>
                    {!! $navItemLang !!}
                </a>
            </li>
        @endforeach
        <li>
            @php($registerPageName = __("frontpage.nav.register"))
            <a href="{{ route('login') }}" title="{{ __('nav.alt',['name' => $registerPageName]) }}"
               class="nav-register">{!! $registerPageName !!}</a>
        </li>
    </ul>
</nav>

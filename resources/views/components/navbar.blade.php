{{--@props(['navbarItems'])--}}
@php($navbarItems = [
        'index',
//        'policy', // Or support, TODO see what to put here
//        'contact',
    ])

<nav class="frontpage-nav">
    <h2 class="sr-only">{!! __('frontpage.nav.title') !!}</h2>
    <a href="{{ route('frontpage.index') }}">
        <img src="{{ asset('/logo.svg') }}" alt="{!! 'App logo' // TODO add logo (title) alt !!}">
    </a>
    <div>
        <ul>
            @foreach($navbarItems as $navbarItem)
                @php($navItemLang = __("frontpage.nav.{$navbarItem}"))
                @php($navItemRoute = route("frontpage.{$navbarItem}"))
                <li>
                    <a href="{{ $navItemRoute }}"
                       title="{{ __('nav.alt',['name' => $navItemLang]) }}" {!! request()->routeIs('frontpage.'.$navbarItem)?'class="active"':'' !!}>
                        {!! $navItemLang !!}
                    </a>
                </li>
            @endforeach
            <li>
                @if(auth()->check())
                    <a href="{{ route('dashboard') }}" title="{{ __('nav.alt',['name' => __('nav.dashboard')]) }}"
                       class="nav-register">{!! __("frontpage.nav.app") !!}</a>
                @else
                @php($loginPageName = __("frontpage.nav.login"))
                <a href="{{ route('login') }}" title="{{ __('nav.alt',['name' => $loginPageName]) }}"
                   class="nav-register">{!! $loginPageName !!}</a>
                @endif
            </li>
        </ul>
    </div>
    <label class="burger-menu">Burger Menu</label>
</nav>

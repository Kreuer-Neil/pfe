{{--@props(['$footerItems'])--}}
@php($footerItems = [
        [
            'name' => 'app',
            'items' => [
                'index',
//                'features',
                'app',
            ]
        ],
        [
            'name' => 'about',
            'items' => [
                'team',
                'contact',
                'policy',
            ]
        ],
        [
            'name' => 'support-title',
            'items' => [
                'faq',
                'support',
            ]
        ],
    ])

<footer>
    <section>
        <h2>{!! __('frontpage.footer.title') !!}</h2>

        <div>
            {{-- Lang nav --}}
            <nav>
                <h3>{!! 'Langage' /*__('general.langage.title')*/ !!}</h3>
                <ul>
                    <li>
                        <a href="">Français</a>
                    </li>
                    <li>
                        <a href="">English</a>
                    </li>
                    <li>
                        <a href="">Deutsch</a>
                    </li>
                </ul>
            </nav>

            @foreach($footerItems as $footerSection)
                @php($sectionName = $footerSection['name'])
                <nav>
                    <h3>{!! __("frontpage.footer.sections.{$sectionName}") !!}</h3>
                    <ul>
                        @foreach($footerSection['items'] as $pageName)
                            <li>
                                <a href="{{ $pageName==='app'? route('register') :route("frontpage.{$pageName}") }}">{!! __("frontpage.footer.sections.{$pageName}") !!}</a>
                            </li>
                        @endforeach
                    </ul>
                </nav>
            @endforeach
            <nav>
                <h2>{!! __('general.socials.title') !!}</h2>
            </nav>
        </div>
    </section>
    <small>©ComeUnite 2026</small>
    {{-- TODO add copyrights later --}}
</footer>

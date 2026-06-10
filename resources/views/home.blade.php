<x-layout.app>
    <main>
{{--        @dd(app()->currentLocale())--}}

        <div class="large-section min-h-[80vh]">
            <h1>{!! __('frontpage.home.header.title') !!}</h1>
            <p class="page-title text-center">{!! __('frontpage.home.header.subtitle') !!}</p>
            <a class="btn" href="{{ route('register') }}">{!! __('frontpage.home.sub-header.cta') !!}</a>
        </div>

        <article class="flex flex-col gap-3">
            <h2>{!! __('frontpage.home.sub-header.title') !!}</h2>
            <p>{!! __('frontpage.home.sub-header.text1') !!}</p>
            <p>{!! __('frontpage.home.sub-header.text2') !!}</p>
        </article>

        <section class="home-features">
            <h2>{!! __('frontpage.home.features.title') !!}</h2>

            <x-frontpage.feature name="tasks"/>
            <x-frontpage.feature name="projects"/>
            <x-frontpage.feature name="sharing"/>
            <x-frontpage.feature name="mobile"/>
        </section>

        <section class="bottom-section large-section">
            <h2>{!! __('frontpage.home.bottom.title') !!}</h2>
            <p>{!! __('frontpage.home.bottom.text') !!}</p>
            <a href="" class="btn">{!! __('frontpage.home.bottom.cta') !!}</a>
        </section>

    </main>
</x-layout.app>

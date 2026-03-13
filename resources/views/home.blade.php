<x-layout.app>
    <main>
        <h1 class="sr-only">ComeUnite - {!! __('frontpage.home.title') !!}</h1>

        <article class="home-header">
            <h2>{!! __('frontpage.home.header.title') !!}</h2>
            <p>{!! __('frontpage.home.header.text1') !!}</p>
            <p>{!! __('frontpage.home.header.text2') !!}</p>
            <a class="btn" href="{{ route('register') }}">{!! __('frontpage.home.header.cta') !!}</a>
        </article>

        <section class="home-features">
            <h2>{!! __('frontpage.home.features.title') !!}</h2>

            <x-frontpage.feature name="organisation"/>
            <x-frontpage.feature name="sharing"/>
        </section>

        <section class="bottom-section">
            <h2>{!! __('frontpage.home.bottom.title') !!}</h2>
            <p>{!! __('frontpage.home.bottom.text') !!}</p>
            <a href="" class="btn">{!! __('frontpage.home.bottom.cta') !!}</a>
        </section>

    </main>
</x-layout.app>

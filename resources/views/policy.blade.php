<x-layout.app :title="__('frontpage.policy.title')">
    <main>

        <div class="large-section mt-12">
            <h1>{!! __('frontpage.policy.title') !!}</h1>
            <p class="page-title text-center">{!! __('frontpage.policy.subtitle') !!}</p>
        </div>

        <section class="policy-section">
            <article class="policy-item">
                <h3>{!! __('frontpage.policy.items.names.title') !!}</h3>
                <p>{!! __('frontpage.policy.items.names.text') !!}</p>
            </article>
            <article class="policy-item">
                <h3>{!! __('frontpage.policy.items.purpose.title') !!}</h3>
                <p>{!! __('frontpage.policy.items.purpose.text') !!}</p>
            </article>
            <article class="policy-item">
                <h3>{!! __('frontpage.policy.items.kindness.title') !!}</h3>
                <p>{!! __('frontpage.policy.items.kindness.text') !!}</p>
            </article>
        </section>

    </main>
</x-layout.app>

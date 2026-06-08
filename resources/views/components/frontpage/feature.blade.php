@props(['name'])
<article class="home-features__item">
    <div>
        <h3>{!! __("frontpage.home.features.{$name}.title") !!}</h3>
        <p>{!! __("frontpage.home.features.{$name}.text") !!}</p>
    </div>
    <img src="{{ asset("/frontpage-content/features/medium/{$name}.png")}}"
         alt="{!! __("frontpage.home.features.{$name}.img-alt") !!}" width="555" height="300"
         srcset="{{asset("/frontpage-content/features/small/{$name}.png")." 0.5x, ". asset("/frontpage-content/features/medium/{$name}.png").", ". asset("/frontpage-content/features/large/{$name}.png")." 3x"}}"
    >
</article>

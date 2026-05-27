@props(['name'])
<article class="home-features__item">
    <div>
        <h3>{!! __("frontpage.home.features.{$name}.title") !!}</h3>
        <p>{!! __("frontpage.home.features.{$name}.text") !!}</p>
    </div>
    <img src="<?= ''// TODO add image source + alt + size ?>" alt="{!! __("frontpage.home.features.{$name}.img-alt") !!}" width="300" height="169">
</article>

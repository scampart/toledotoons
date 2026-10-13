/* Billboard slideshow: random live-event and online-order samples fill the whole billboard face on wide
   screens. Phones (860px and under) get the compact billboard with the logo only, so no slideshow. */
(function () {
  var screen = document.getElementById('billboardShow');
  if (!screen) return;
  var mq = window.matchMedia('(max-width:860px)');
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var live = ['live-caricature-bearded-man', 'live-caricature-boy-braces', 'live-caricature-boy-racing-cap', 'live-caricature-brooklyn-man', 'live-caricature-couple', 'live-caricature-man-mohawk', 'live-caricature-man-red-cap', 'live-caricature-mustache-man', 'live-caricature-teen-sports-cap', 'live-caricature-young-man']
    .map(function (n) { return { src: 'images/gallery/' + n + '.webp', alt: 'Live event caricature', tag: 'Live event', o: false }; });
  var ord = ['comm-wedding-couple', 'comm-firefighter', 'comm-golfer', 'comm-superhero-comic-cover', 'comm-retro-gamer', 'comm-avengers-family', 'comm-pizza-cook', 'comm-bobblehead-crate', 'comm-muscle-car-road-trip']
    .map(function (n) { return { src: 'images/gallery/' + n + '.webp', alt: 'Custom caricature order', tag: 'Online order', o: true }; });
  var steps = { src: 'images/order-steps.png', alt: 'Three steps: upload a photo, the artist draws it, receive it by email', tag: 'How online orders work', o: true, wide: true };
  var timer = null, cur = 0;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function fig(it, eager) {
    return '<figure><div class="ph"><img src="' + it.src + '" alt="' + it.alt + '"' + (eager ? '' : ' loading="lazy"') + ' decoding="async"></div><figcaption' + (it.o ? ' class="o"' : '') + '>' + it.tag + '</figcaption></figure>';
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  function build() {
    stop();
    screen.innerHTML = '';
    if (mq.matches) return;                                  // phone: logo only
    // interleave live and order samples, then deal them out three to a slide
    var l = shuffle(live), o = shuffle(ord), seq = [], i;
    var flip = Math.random() < 0.5;
    for (i = 0; i < Math.max(l.length, o.length); i++) {
      var pair = flip ? [o[i], l[i]] : [l[i], o[i]];
      pair.forEach(function (it) { if (it) seq.push(it); });
    }
    var slides = [];
    for (i = 0; i < seq.length; i += 3) { slides.push(seq.slice(i, i + 3)); }
    slides.splice(Math.floor(Math.random() * (slides.length + 1)), 0, [steps]);
    slides.forEach(function (g, n) {
      var d = document.createElement('div');
      d.className = 'slide' + (g[0].wide ? ' wide' : '') + (n === 0 ? ' on' : '');
      d.innerHTML = g.map(function (it) { return fig(it, n === 0); }).join('');
      screen.appendChild(d);
    });
    cur = 0;
    var els = screen.children;
    if (reduce || els.length < 2) return;
    timer = setInterval(function () {
      if (document.hidden) return;
      els[cur].classList.remove('on');
      cur = (cur + 1) % els.length;
      els[cur].classList.add('on');
    }, 4200);
  }

  build();
  var last = mq.matches;
  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(function () {
      if (mq.matches !== last) { last = mq.matches; build(); }
    }, 200);
  });
})();

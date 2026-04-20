/* ============================================================
   Shared chrome injected on every page so we don't duplicate
   nav / overlays / footer / tweaks panel markup.
   Pages mark active link via <body data-page="shows">.
   ============================================================ */

(() => {
  const page = document.body.dataset.page || 'home';

  const overlays = `
    <div class="grain"></div>
    <div class="scanlines"></div>
    <canvas id="brush-trail"></canvas>
    <div class="cursor-ring"></div>
    <div class="cursor-dot"></div>
    <div class="fx-curtain"></div>
  `;

  const nav = `
    <nav class="nav">
      <a href="index.html" class="nav__brand">
        Cores<span class="dot"></span>do Samba
      </a>
      <div class="nav__links">
        <a href="shows.html" data-link="shows">Shows</a>
        <a href="music.html" data-link="music">Música</a>
        <a href="gallery.html" data-link="gallery">Galeria</a>
        <a href="contact.html" data-link="contact">Contato</a>
      </div>
      <div class="nav__lang">
        <span class="on">PT</span>/<span>EN</span>
      </div>
    </nav>
  `;

  const footer = `
    <footer>
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            Cores<br/>do <em>samba</em>
          </div>
          <div class="footer__col">
            <div class="footer__col-title">Site</div>
            <a href="shows.html">Shows</a>
            <a href="music.html">Música</a>
            <a href="gallery.html">Galeria</a>
            <a href="contact.html">Contato</a>
          </div>
          <div class="footer__col">
            <div class="footer__col-title">Ouça</div>
            <a href="#">Spotify</a>
            <a href="#">YouTube</a>
            <a href="#">Apple Music</a>
            <a href="#">Tidal</a>
          </div>
          <div class="footer__col">
            <div class="footer__col-title">Newsletter</div>
            <a href="#">Inscrever →</a>
            <a href="#">Imprensa</a>
            <a href="#">EPK</a>
          </div>
        </div>
        <div class="footer__bottom">
          <span>© 2026 Cores do Samba — Todos os direitos reservados</span>
          <span>Salvador · Bahia · Brasil</span>
        </div>
      </div>
    </footer>
  `;

  const tweaks = `
    <div class="tweaks" id="tweaks">
      <div class="tweaks__title">Tweaks</div>
      <div class="tweaks__row">
        <div class="tweaks__label">Palette</div>
        <div class="tweaks__palette" id="tw-palette">
          <button class="on" data-pal="neon" style="background: linear-gradient(135deg, #ff1f6b, #00f5d4, #9d4edd);" title="Neon Night"></button>
          <button data-pal="vinyl" style="background: linear-gradient(135deg, #C1272D, #F2A900, #0A6E5C);" title="Vinyl Craft"></button>
          <button data-pal="tropical" style="background: linear-gradient(135deg, #E63946, #FFB627, #06A77D);" title="Tropical"></button>
          <button data-pal="dusk" style="background: linear-gradient(135deg, #ff006e, #fb5607, #ffbe0b);" title="Dusk"></button>
        </div>
      </div>
      <div class="tweaks__row">
        <div class="tweaks__label">Display font</div>
        <div class="tweaks__fonts">
          <select id="tw-font">
            <option value="bricolage">Bricolage Grotesque</option>
            <option value="bebas">Bebas Neue</option>
            <option value="anton">Anton</option>
            <option value="archivo">Archivo Black</option>
          </select>
        </div>
      </div>
      <div class="tweaks__row">
        <div class="tweaks__label">Grain intensity</div>
        <input type="range" id="tw-grain" min="0" max="20" value="7" step="1" style="width:100%;" />
      </div>
    </div>
  `;

  // Inject overlays at top of body
  document.body.insertAdjacentHTML('afterbegin', overlays + nav);
  document.body.insertAdjacentHTML('beforeend', footer + tweaks);

  // Highlight active nav link
  document.querySelectorAll(`.nav__links a[data-link="${page}"]`).forEach(a => {
    a.style.color = 'var(--c-magenta)';
  });
})();

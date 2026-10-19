<script setup lang="ts">
const localePath = useLocalePath()
const here = (hash: string) => `${localePath('/')}#${hash}`
const year = new Date().getFullYear()
</script>

<template>
  <footer class="l-foot">
    <div class="l-foot-board">
      <section
        class="l-foot-thanks"
        aria-labelledby="foot-thanks"
      >
        <h2 id="foot-thanks">
          {{ $t('site.foot.thanks') }}
        </h2>
        <i18n-t
          keypath="site.foot.thanksText"
          tag="p"
          scope="global"
        >
          <template #oklab>
            <a
              href="https://bottosson.github.io/posts/oklab/"
              target="_blank"
              rel="noopener noreferrer"
            >OKLab</a>
          </template>
          <template #vitesse>
            <a
              href="https://github.com/antfu/vscode-theme-vitesse"
              target="_blank"
              rel="noopener noreferrer"
            >Vitesse</a>
          </template>
          <template #treesitter>
            <a
              href="https://github.com/nvim-treesitter/nvim-treesitter"
              target="_blank"
              rel="noopener noreferrer"
            >nvim-treesitter</a>
          </template>
          <template #shiki>
            <a
              href="https://shiki.style"
              target="_blank"
              rel="noopener noreferrer"
            >Shiki</a>
          </template>
          <template #geist>
            <a
              href="https://vercel.com/font"
              target="_blank"
              rel="noopener noreferrer"
            >Geist</a>
          </template>
          <template #instrument>
            <a
              href="https://fonts.google.com/specimen/Instrument+Serif"
              target="_blank"
              rel="noopener noreferrer"
            >Instrument Serif</a>
          </template>
          <template #allura>
            <a
              href="https://github.com/googlefonts/allura"
              target="_blank"
              rel="noopener noreferrer"
            >Allura</a>
          </template>
        </i18n-t>
      </section>
      <section aria-labelledby="foot-site">
        <h2 id="foot-site">
          {{ $t('site.foot.site') }}
        </h2>
        <ul>
          <li>
            <NuxtLink :to="here('syntax')">
              {{ $t('nav.syntax') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="here('palette')">
              {{ $t('nav.palette') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="here('downloads')">
              {{ $t('nav.downloads') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/notes')">
              {{ $t('nav.notes') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/docs')">
              {{ $t('nav.docs') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/changelog')">
              {{ $t('nav.changelog') }}
            </NuxtLink>
          </li>
        </ul>
      </section>
      <section aria-labelledby="foot-editors">
        <h2 id="foot-editors">
          {{ $t('site.foot.editors') }}
        </h2>
        <ul>
          <li>
            <a
              href="https://github.com/0froq/lig.nvim"
              target="_blank"
              rel="noopener noreferrer"
            >Neovim</a>
          </li>
          <li>
            <a
              href="https://github.com/0froq/vscode-theme-LiG"
              target="_blank"
              rel="noopener noreferrer"
            >VS Code</a>
          </li>
          <li>
            <a
              href="https://github.com/0froq/zed-theme-LiG"
              target="_blank"
              rel="noopener noreferrer"
            >Zed</a>
          </li>
        </ul>
      </section>
      <section aria-labelledby="foot-elsewhere">
        <h2 id="foot-elsewhere">
          {{ $t('site.foot.elsewhere') }}
        </h2>
        <ul>
          <li>
            <a
              href="https://froq.me"
              target="_blank"
              rel="noopener noreferrer"
            >froQ</a>
          </li>
          <li>
            <a
              href="https://github.com/0froq"
              target="_blank"
              rel="noopener noreferrer"
            >GitHub</a>
          </li>
          <li>
            <a href="mailto:sayhola@froq.me">{{ $t('site.foot.mail') }}</a>
          </li>
          <li>
            <a
              href="https://github.com/0froq/ui"
              target="_blank"
              rel="noopener noreferrer"
            >{{ $t('site.foot.ui') }}</a>
          </li>
        </ul>
      </section>
    </div>
    <div
      class="l-foot-band"
      data-anchor="foot-band"
      aria-hidden="true"
    />
    <p
      class="l-foot-mark"
      aria-hidden="true"
    >
      Less is Great<span
        class="l-foot-stop"
        data-anchor="foot-mark"
      >.</span>
    </p>
    <p class="l-foot-legal">
      <span>© {{ year }} froQ</span>
      <a
        href="https://github.com/0froq/lig/blob/main/LICENSE"
        target="_blank"
        rel="noopener noreferrer"
      >{{ $t('site.license') }}</a>
      <a
        href="https://github.com/0froq/lig"
        target="_blank"
        rel="noopener noreferrer"
      >{{ $t('site.source') }}</a>
    </p>
  </footer>
</template>

<style scoped>
/* Links and thanks share one board; the name below is set as large as the frame allows. */
.l-foot {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  min-height: 88svh;
  --edge: clamp(80px, 11vw, 220px);
  box-sizing: border-box;
  /* The same centered measure on every page, whatever width the page above uses. */
  width: min(1080px, calc(100vw - var(--edge) * 2));
  margin-inline: auto;
  padding: clamp(72px, 12svh, 128px) 0 clamp(20px, 3svh, 32px);
  overflow: clip;
  color: var(--muted);
}

.l-foot h2 {
  margin: 0 0 16px;
  color: var(--muted);
  font: 11px/1.4 var(--font-meta);
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.l-foot-board {
  display: grid;
  grid-template-columns: minmax(0, 2fr) repeat(3, minmax(0, 1fr));
  gap: 32px clamp(24px, 4cqi, 48px);
  padding-top: 20px;
  border-top: 1px solid var(--line);
}

.l-foot ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.l-foot li + li {
  margin-top: 6px;
}

.l-foot-board a {
  color: var(--fg);
  font-size: 15px;
  line-height: 1.5;
}

/* The wide first track carries the thanks; the link columns sit to its right. */
.l-foot-thanks {
  padding-inline-end: clamp(0px, 2cqi, 24px);
}

.l-foot-thanks p {
  margin: 0;
  color: var(--muted);
  font-family: var(--font-display);
  font-size: clamp(18px, 1.75cqi, 22px);
  line-height: 1.3;
  letter-spacing: -0.01em;
  text-wrap: pretty;
}

.l-foot-thanks a {
  padding-bottom: 0.06em;
  color: var(--fg);
  /* A rule under every link; the pen draws over it, left to right, on hover. */
  background:
    linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat,
    linear-gradient(var(--line), var(--line)) 0 100% / 100% 1px no-repeat;
  transition:
    color 0.3s var(--ease),
    background-size 0.5s var(--ease);
}

.l-foot-thanks a:hover,
.l-foot-thanks a:focus-visible {
  background-size:
    100% 1px,
    100% 1px;
}

@media (prefers-reduced-motion: reduce) {
  .l-foot-thanks a {
    transition: color 0.3s var(--ease);
  }
}

/* The name fills the frame. It sits on the last rule like a word on a baseline. */
.l-foot-band {
  flex: none;
  margin-top: auto;
  height: clamp(72px, 12svh, 144px);
}

.l-foot-mark {
  margin: 0;
  color: var(--fg);
  font-family: var(--font-display);
  font-size: 26.4cqi;
  font-weight: 400;
  line-height: 0.78;
  letter-spacing: -0.045em;
  white-space: nowrap;
}

/* The pen or the paper lands this stop; see kit.css for when it hides until then. */
.l-foot-stop {
  display: inline-block;
  color: var(--accent);
}

.l-foot-legal {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin: 14px 0 0;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  font: 12px/1.5 var(--font-meta);
}

.l-foot-legal span {
  margin-inline-end: auto;
}

.l-foot a {
  transition:
    color 0.3s var(--ease),
    text-decoration-color 0.3s var(--ease);
}

.l-foot a:hover {
  color: var(--accent);
}

.l-foot a:focus-visible {
  outline: 1px solid var(--accent);
  outline-offset: 3px;
}

:lang(zh) .l-foot-thanks p {
  letter-spacing: 0;
  line-height: 1.45;
}

@media (max-width: 860px) {
  .l-foot {
    min-height: 0;
  }

  .l-foot {
    width: auto;
    margin-inline: 0;
    padding-inline: clamp(16px, 4vw, 28px);
  }

  .l-foot-board {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .l-foot-thanks {
    order: 1;
    grid-column: 1 / -1;
    padding-inline-end: 0;
  }

  .l-foot-thanks p {
    font-size: clamp(20px, 5vw, 24px);
  }
}
</style>

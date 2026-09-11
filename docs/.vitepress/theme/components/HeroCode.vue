<script setup>
import heroCodeHtml from "virtual:hero-code";
</script>

<template>
    <figure class="hero-code">
        <figcaption class="hero-code-bar">
            <span class="hero-code-dot" aria-hidden="true"></span>
            ContactList.vue
        </figcaption>
        <!-- eslint-disable-next-line vue/no-v-html -- Shiki markup rendered at config load, not user input. -->
        <div class="vp-doc hero-code-body" v-html="heroCodeHtml"></div>
    </figure>
</template>

<style scoped>
.hero-code {
    margin: 0;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    background-color: var(--vp-code-block-bg);
    overflow: hidden;
    text-align: left;
}
.hero-code-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid var(--vp-c-divider);
    padding: 10px 16px;
    color: var(--vp-c-text-2);
    font-family: var(--vp-font-family-mono);
    font-size: 12px;
}
.hero-code-dot {
    border-radius: 50%;
    width: 8px;
    height: 8px;
    background-color: var(--vp-c-brand-1);
}
.hero-code-body :deep(div[class*="language-"]) {
    margin: 0;
    border-radius: 0;
}
.hero-code-body :deep(code) {
    font-size: 12px;
    line-height: 1.6;
}
.hero-code-body :deep(.lang) {
    display: none;
}
</style>

<style>
/* The default hero sizes its image column for a square logo. A code panel
   needs the full column, no translate offset, and no blurred backdrop. */
.VPHero .image {
    order: 3;
    /* Let the column shrink below the code's intrinsic width so long lines
       scroll inside the panel instead of widening the hero. */
    min-width: 0;
    margin: 24px 0 0;
}
.VPHero .image-container {
    display: block;
    width: 100%;
    height: auto;
    transform: none;
}
.VPHero .image-bg {
    display: none;
}

/* Below this width the code column is too narrow for the example's longest
   line, so the panel stacks under the copy and keeps the whole example
   readable. */
@media (min-width: 960px) and (max-width: 1279px) {
    .VPHero .container {
        flex-direction: column;
    }
}

@media (min-width: 1280px) {
    /* The doubled class outweighs the default theme's scoped rule. */
    .VPHero.has-image .main.main {
        max-width: 520px;
    }
    .VPHero .image {
        order: 2;
        margin: 0;
    }
}
</style>

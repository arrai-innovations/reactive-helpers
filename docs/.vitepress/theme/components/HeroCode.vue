<script setup>
import { ArraiPreview } from "@arrai-innovations/vitepress-theme";
import heroCodeHtml from "virtual:hero-code";
</script>

<template>
    <ArraiPreview label="ContactList.vue">
        <!-- eslint-disable-next-line vue/no-v-html -- Shiki markup rendered at config load, not user input. -->
        <div class="vp-doc hero-code-body" v-html="heroCodeHtml"></div>
    </ArraiPreview>
</template>

<style scoped>
.hero-code-body :deep(div[class*="language-"]) {
    margin: 0;
    border-radius: 0;
}
.hero-code-body :deep(code) {
    font-size: 0.75rem;
    line-height: 1.6;
}
.hero-code-body :deep(.lang) {
    display: none;
}
</style>

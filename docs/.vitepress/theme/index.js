import { createArraiTheme } from "@arrai-innovations/vitepress-theme";
import { h } from "vue";

import HeroCode from "./components/HeroCode.vue";

// The homepage hero fills its image column with a code panel instead of a logo.
export default createArraiTheme({
    layoutSlots: { "home-hero-image": () => h(HeroCode) },
});

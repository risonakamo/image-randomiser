import {vitePreprocess} from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
  onwarn(warning,handler)
  {
    if (warning.code.includes("a11y"))
    {
      return;
    }

    handler(warning);
  }
};
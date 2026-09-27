/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  compilerOptions: {
    // Components inject their own styles, so they land in <admin-app>'s shadow root.
    css: 'injected'
  }
}

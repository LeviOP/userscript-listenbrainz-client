import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        monkey({
            entry: "src/main.ts",
            userscript: {
                version: "0.0.1",
                author: "LeviOP",
                namespace: "https://github.com/LeviOP",
                match: ["*://*.youtube.com/*"]
            }
        })
    ]
});

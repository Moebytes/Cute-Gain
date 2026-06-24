import {defineConfig} from "@rsbuild/core"
import {pluginReact} from "@rsbuild/plugin-react"
import {pluginSass} from "@rsbuild/plugin-sass"

export default defineConfig({
    tools: {
        rspack(config) {
            config.module = config.module || {}
            config.module.rules = config.module.rules || []
            
            config.module.rules.push({
                test: /\.svg$/,
                type: "javascript/auto",
                use: [{
                    loader: "@svgr/webpack", 
                    options: {
                        svgoConfig: {
                            plugins: [
                                {name: "preset-default", params: {overrides: {removeViewBox: false}}}
                            ]
                        }
                    }
                }]
            })

            return config
        }
    },
    plugins: [pluginReact(), pluginSass()],
    dev: {
        hmr: true,
        writeToDisk: true
    },
    html: {
        template: "./index.html"
    },
    source: {
        entry: {
            index: "./index.tsx"
        }
    },
    output: {
        filenameHash: false
    }
})
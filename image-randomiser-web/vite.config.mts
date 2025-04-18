import {defineConfig} from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
import {LogLevel,RollupLog,LogHandler} from "rollup";
import {svelte} from "@sveltejs/vite-plugin-svelte";
import {Warning} from "svelte/compiler";

type SvelteWarningHandler=(warning:Warning)=>void

declare const __dirname:string;

export default defineConfig({
    root:`${__dirname}/web/html`,
    mode:"development",
    base:"",

    plugins:[
        svelte({
            configFile:`${__dirname}/svelte.config.js`,
            onwarn:svelteWarningHandler,
        }),
        checker({
            typescript:true
        }),
        tsconfigPaths()
    ],

    css:{
        preprocessorOptions:{
            sass:{
                api:"modern"
            }
        }
    },

    resolve:{
        alias:{
            "@":`${__dirname}/web`,
        }
    },

    build:{
        outDir:`${__dirname}/build`,
        target:["esnext"],
        sourcemap:true,
        // emptyOutDir:true,
        minify:false,

        rollupOptions:{
            input:{
                "session-viewer":`${__dirname}/web/html/session-viewer.html`,
            },

            onLog(level:LogLevel,log:RollupLog,handler:LogHandler):void
            {
                if (log.message.includes("Error when using sourcemap for reporting"))
                {
                    return;
                }

                handler(level,log);
            }
        }
    },

    // test:{
    //     root:`${__dirname}/tests`
    // }
});

/** custom svelte warning handler */
function svelteWarningHandler(warning:Warning,handler:SvelteWarningHandler):void
{
    // console.log("svelte warning:",warning.code);

    switch (warning.code)
    {
        case "css_unused_selector":
        return;
    }

    if (warning.code.includes("a11y"))
    {
        return;
    }

    handler(warning);
}
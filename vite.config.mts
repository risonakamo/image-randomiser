// used for vitest only

import {defineConfig} from "vitest/config";
declare const __dirname:string;

export default defineConfig({
    resolve:{
        alias:{
            "@":`${__dirname}/app`,
        }
    },

    test:{
        root:`${__dirname}/tests`
    }
});
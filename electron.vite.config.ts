import {UserConfig} from "electron-vite";

export default {
    main:{
        build:{
            outDir:"build",
            lib:{
                entry:"app/main.ts",
            }
        }
    },
    preload:{
        build:{
            outDir:"build/bridge",
            lib:{
                entry:"app/bridge.ts",
            }
        }
    }
} satisfies UserConfig;
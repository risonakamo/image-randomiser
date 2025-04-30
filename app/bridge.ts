// defines frontend api

import {contextBridge,ipcRenderer,webUtils} from "electron";

const bridge:Bridge={
    getTestSession():Promise<RandomisationSession>
    {
        return ipcRenderer.invoke("get-test-session");
    },

    launchItem(item:string,program:string):Promise<void>
    {
        return ipcRenderer.invoke("launch-item",item,program);
    },

    getPrograms():Promise<string[]>
    {
        return ipcRenderer.invoke("get-programs");
    },

    /** get absolute path of a file objs (ie from drop). also filters to only the paths
     *  that are dirs
     */
    absPathDirs(files:File[]):Promise<string[]>
    {
        const paths:string[]=files.map((file:File):string=>{
            return webUtils.getPathForFile(file);
        });

        return ipcRenderer.invoke("filter-dirs",paths);
    }
};

contextBridge.exposeInMainWorld("electron",bridge);
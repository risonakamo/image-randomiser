// defines frontend api

import {contextBridge,ipcRenderer, webUtils} from "electron";

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

    /** get absolute path of a file objs (ie from drop) */
    absPath(files:File[]):string[]
    {
        return files.map((file:File):string=>{
            return webUtils.getPathForFile(file);
        });
    }
};

contextBridge.exposeInMainWorld("electron",bridge);
// defines frontend api

import {contextBridge,ipcRenderer} from "electron";

const bridge:Bridge={
    getTestSession():Promise<RandomisationSession>
    {
        return ipcRenderer.invoke("get-test-session");
    },

    launchItem(item:string,program:string):Promise<void>
    {
        return ipcRenderer.invoke("launch-item",item,program);
    },
};

contextBridge.exposeInMainWorld("electron",bridge);
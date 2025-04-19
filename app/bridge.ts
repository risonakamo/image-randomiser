// defines frontend api

import {contextBridge,ipcRenderer} from "electron";

const bridge:Bridge={
    getTestSession():Promise<RandomisationSession>
    {
        return ipcRenderer.invoke("get-test-session");
    },
};

contextBridge.exposeInMainWorld("electron",bridge);
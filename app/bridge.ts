// defines frontend api

import {contextBridge,ipcRenderer} from "electron";

const bridge:Bridge={

};

contextBridge.exposeInMainWorld("electron",bridge);
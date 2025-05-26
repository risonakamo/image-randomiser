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
     *  that are dirs. code is here instead of main because only works in renderer */
    absPathDirs(files:File[]):Promise<string[]>
    {
        const paths:string[]=files.map((file:File):string=>{
            return webUtils.getPathForFile(file);
        });

        return ipcRenderer.invoke("filter-dirs",paths);
    },

    newSession(folders:string[],title:string):Promise<void>
    {
        return ipcRenderer.invoke("new-session",folders,title);
    },

    getSessions():Promise<RandomisationSession[]>
    {
        return ipcRenderer.invoke("get-sessions");
    },

    deleteSession(deleteId:string):Promise<RandomisationSession[]>
    {
        return ipcRenderer.invoke("delete-session",deleteId);
    },

    duplicateSession(duplicateId:string,title:string):Promise<RandomisationSession[]>
    {
        return ipcRenderer.invoke("duplicate-session",duplicateId,title);
    },

    getItemCount(folders:string[]):Promise<ItemCounts>
    {
        return ipcRenderer.invoke("get-items-count",folders);
    },

    getSession(sessionId:string):Promise<RandomisationSession|undefined>
    {
        return ipcRenderer.invoke("get-session",sessionId);
    },

    openFileExplorer(item:string):Promise<void>
    {
        return ipcRenderer.invoke("open-file-explorer",item);
    },

    updateSessionPosition(sessionId:string,newPosition:number):Promise<void>
    {
        return ipcRenderer.invoke("update-session-position",sessionId,newPosition);
    },

    getRememberedFolders():Promise<RememberedFolder[]>
    {
        return ipcRenderer.invoke("get-remembered-folders");
    },
};

contextBridge.exposeInMainWorld("electron",bridge);
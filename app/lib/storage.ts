import {join,dirname} from "path";
import {existsSync,readFileSync,mkdirSync,writeFileSync} from "fs";
import _ from "lodash";

import {duplicateSession} from "./randomisation";

const StorePath:string=getStorePath();
const StorePath2:string=getStorePath2();

/** empty store state */
const defaultStore:ImageRandomiserStore={
    sessions:[],
};

/** empty store state 2 */
const defaultStore2:ImageRandomiserStore2={
    rememberedFolders:{},
};

/** add session to store */
export function addSession(session:RandomisationSession):RandomisationSession[]
{
    const store:ImageRandomiserStore=readStore();
    const store2:ImageRandomiserStore2=readStore2();

    store.sessions.push(session);

    addRememberedFolders(store2,session.originDirs);

    writeStore(store);
    writeStore2(store2);

    return store.sessions;
}

/** get sessions */
export function getSessions():RandomisationSession[]
{
    const store:ImageRandomiserStore=readStore();
    return store.sessions;
}

/** delete a session, return the updated session list */
export function deleteSession(id:string):RandomisationSession[]
{
    const store:ImageRandomiserStore=readStore();

    _.remove(store.sessions,(session:RandomisationSession):boolean=>{
        return session.id==id;
    });

    writeStore(store);

    return store.sessions;
}

/** duplicate session in the store with target id and new title */
export function duplicateSessionInStore(id:string,title:string):RandomisationSession[]
{
    const store:ImageRandomiserStore=readStore();

    const foundSession:RandomisationSession|undefined=_.find(
        store.sessions,
        (session:RandomisationSession):boolean=>{
            return session.id==id;
        }
    );

    if (!foundSession)
    {
        console.warn("failed to duplicate session: could not find target session");
        return store.sessions;
    }

    const newSession:RandomisationSession=duplicateSession(foundSession,title);

    return addSession(newSession);
}

/** try to get a single session by id */
export function getSession(id:string):RandomisationSession|undefined
{
    const store:ImageRandomiserStore=readStore();

    const foundSession:RandomisationSession|undefined=_.find(
        store.sessions,
        (session:RandomisationSession):boolean=>{
            return session.id==id;
        },
    );

    if (!foundSession)
    {
        console.warn("failed to find session:",id);
    }

    return foundSession;
}

/** update a session's position in storage. also updates the last update date */
export function updateSession(sessionId:string,newPosition:number):void
{
    const store:ImageRandomiserStore=readStore();

    const foundSessIndex:number=_.findIndex(
        store.sessions,
        (session:RandomisationSession):boolean=>{
            return session.id==sessionId;
        },
    );

    if (foundSessIndex<0)
    {
        console.error("could not update session: failed to find");
        return;
    }

    store.sessions[foundSessIndex].position=newPosition;
    store.sessions[foundSessIndex].lastUpdateDate=new Date().getTime();

    writeStore(store);
}

/** get list of remembered folders from storage. sorted by last used date */
export function getRememberedFolders():RememberedFolder[]
{
    const store:ImageRandomiserStore2=readStore2();
    return _.reverse(_.sortBy(Object.values(store.rememberedFolders),
    (folder:RememberedFolder):number=>{
        return folder.lastUseDate;
    }));
}

/** add list of remembered folders to a store's remembered folders field.
 *  mutates the store. skips folders with 0 items */
function addRememberedFolders(
    store:ImageRandomiserStore2,
    folders:RandomableFolder[],
):ImageRandomiserStore2
{
    for (var folderI=0;folderI<folders.length;folderI++)
    {
        const folder:RandomableFolder=folders[folderI];

        if (folder.itemsCount==0)
        {
            continue;
        }

        // already remembered. update the entry
        if (folder.path in store.rememberedFolders)
        {
            store.rememberedFolders[folder.path].itemsCount=folder.itemsCount;
            store.rememberedFolders[folder.path].timesUsed+=1;
            store.rememberedFolders[folder.path].lastUseDate=new Date().getTime();
        }

        // otherwise, add the entry
        else
        {
            store.rememberedFolders[folder.path]={
                ...folder,
                timesUsed:1,
                lastUseDate:new Date().getTime(),
            };
        }
    }

    return store;
}

/** read from data store */
function readStore():ImageRandomiserStore
{
    if (!existsSync(StorePath))
    {
        return _.cloneDeep(defaultStore);
    }

    const rawData:string=readFileSync(StorePath,"utf-8");
    return JSON.parse(rawData);
}

/** read from data store 2 */
function readStore2():ImageRandomiserStore2
{
    if (!existsSync(StorePath2))
    {
        return _.cloneDeep(defaultStore2);
    }

    const rawData:string=readFileSync(StorePath2,"utf-8");
    return JSON.parse(rawData);
}

/** override the store with new data */
function writeStore(store:ImageRandomiserStore):void
{
    mkdirSync(
        dirname(StorePath),{
            recursive:true,
        }
    );

    const jsonData:string=JSON.stringify(store);
    writeFileSync(StorePath,jsonData,"utf-8");
}

/** override the store with new data */
function writeStore2(store:ImageRandomiserStore2):void
{
    mkdirSync(
        dirname(StorePath2),{
            recursive:true,
        }
    );

    const jsonData:string=JSON.stringify(store);
    writeFileSync(StorePath2,jsonData,"utf-8");
}

/** reset both stores to initial state */
export function resetStore():void
{
    writeStore(_.cloneDeep(defaultStore));
    writeStore2(_.cloneDeep(defaultStore2));
}

/** get the store path based on the build mode */
function getStorePath():string
{
    console.log("meta",import.meta.env);

    if (import.meta.env.VITE_PROD=="true")
    {
        return join(__dirname,"data","data.json");
    }

    else
    {
        return join(__dirname,"..","data","data.json");
    }
}

/** get the store2 path based on the build mode */
function getStorePath2():string
{
    return join(__dirname,"..","data","data2.json");
}
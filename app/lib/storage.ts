import {join,dirname} from "path";
import {existsSync,readFileSync,mkdirSync,writeFileSync} from "fs";
import _ from "lodash";

import {duplicateSession} from "./randomisation";

// for release:
// const StorePath:string=join(__dirname,"data","data.json");

// for dev:
const StorePath:string=join(__dirname,"..","data","data.json");

/** add session to store */
export function addSession(session:RandomisationSession):RandomisationSession[]
{
    const store:ImageRandomiserStore=readStore();

    store.sessions.push(session);

    writeStore(store);

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

/** read from data store */
function readStore():ImageRandomiserStore
{
    if (!existsSync(StorePath))
    {
        return {
            sessions:[],
        };
    }

    const rawData:string=readFileSync(StorePath,"utf-8");
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
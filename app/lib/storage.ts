import {join,dirname} from "path";
import {existsSync,readFileSync,mkdirSync,writeFileSync} from "fs";

const StorePath:string=join(__dirname,"data","data.json");

/** add session to store */
export function addSession(session:RandomisationSession):void
{
    const store:ImageRandomiserStore=readStore();

    store.sessions.push(session);

    writeStore(store);
}

/** get sessions */
export function getSessions():RandomisationSession[]
{
    const store:ImageRandomiserStore=readStore();
    return store.sessions;
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
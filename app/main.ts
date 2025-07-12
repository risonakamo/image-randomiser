import {app,BrowserWindow,ipcMain,IpcMainInvokeEvent,screen} from "electron";
import {join,basename} from "path";
import _ from "lodash";
import {statSync} from "fs";

import {createSession, getItemCount} from "./lib/randomisation";
import {openFileExplorerTo, Programs, runWithProgram} from "./lib/launch";
import {addSession, deleteSession, duplicateSessionInStore,
    getRememberedFolders, getSession, getSessions, resetStore,
    updateSession} from "./lib/storage";

function main()
{
    app.on("ready",()=>{
        // resetStore();

        const display:Electron.Size=screen.getPrimaryDisplay().workAreaSize;

        const window=new BrowserWindow({
            width:Math.round(display.width*.78),
            height:Math.round(display.height*.85),
            minWidth:900,
            minHeight:620,
            webPreferences:{
                preload:join(__dirname,"bridge/bridge.js"),
            }
        });

        window.loadFile("image-randomiser-web/build/session-select.html");
    });


    // --- apis
    // return a session for testing
    ipcMain.handle("get-test-session",():RandomisationSession=>{
        const session:RandomisationSession=createSession(
            [
                "C:/Users/ktkm/Desktop/draw/ref/imgs",
                "C:/Users/ktkm/Desktop/h/cg",
                "C:/Users/ngokn1/Pictures",
            ],
            "test session",
        );

        return session;
    });

    // launch item with program
    ipcMain.handle("launch-item",
        (e:IpcMainInvokeEvent,item:string,program:string):void=>{
            runWithProgram(item,program);
        },
    );

    // get list of available launch program names
    ipcMain.handle("get-programs",():string[]=>{
        return _.map(Programs,(program:LaunchProgram):string=>{
            return program.name;
        });
    });

    // given strings, filter to the ones that are dirs
    ipcMain.handle("filter-dirs",
        (e:IpcMainInvokeEvent,paths:string[]):DirItem[]=>{
            const dirsOnly:string[]=_.filter(paths,(aPath:string):boolean=>{
                return statSync(aPath).isDirectory();
            });

            return _.map(dirsOnly,(dirPath:string):DirItem=>{
                return {
                    path:dirPath,
                    name:basename(dirPath),
                };
            });
        },
    );

    // create a new session, add to storage
    ipcMain.handle("new-session",
        (e:IpcMainInvokeEvent,folders:string[],title:string):void=>{
            const session:RandomisationSession=createSession(folders,title);

            addSession(session);
        },
    );

    // get the sessions from storage
    ipcMain.handle("get-sessions",():RandomisationSession[]=>{
        return getSessions();
    });

    // delete a session. returns the new session list
    ipcMain.handle("delete-session",
        (e:IpcMainInvokeEvent,deleteId:string):RandomisationSession[]=>{
            return deleteSession(deleteId);
        }
    );

    // duplicate session. returns the new session list
    ipcMain.handle("duplicate-session",
        (e:IpcMainInvokeEvent,duplicateId:string,title:string):RandomisationSession[]=>{
            return duplicateSessionInStore(duplicateId,title);
        }
    );

    // get number of items in the target dirs
    ipcMain.handle("get-items-count",
        (e:IpcMainInvokeEvent,folders:string[]):ItemCounts=>{
            return getItemCount(folders);
        }
    );

    // get a single session
    ipcMain.handle("get-session",
        (e:IpcMainInvokeEvent,sessionId:string):RandomisationSession|undefined=>{
            return getSession(sessionId);
        }
    );

    // open file explorer to the target path
    ipcMain.handle("open-file-explorer",
        (e:IpcMainInvokeEvent,item:string):void=>{
            openFileExplorerTo(item);
        }
    );

    // update a session's details
    ipcMain.handle("update-session-position",
        (e:IpcMainInvokeEvent,sessionId:string,newPosition:number):void=>{
            updateSession(sessionId,newPosition);
        },
    );

    // get current remembered folders
    ipcMain.handle("get-remembered-folders",():RememberedFolder[]=>{
        return getRememberedFolders();
    });

    // reset the store
    ipcMain.handle("reset-store",():void=>{
        resetStore();
    });
}

main();
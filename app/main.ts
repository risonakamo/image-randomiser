import {app,BrowserWindow,ipcMain,IpcMainInvokeEvent,screen} from "electron";
import {join} from "path";
import _ from "lodash";
import {statSync} from "fs";

import {createSession} from "./lib/randomisation";
import {Programs, runWithProgram} from "./lib/launch";
import {addSession, getSessions} from "./lib/storage";

function main()
{
    app.on("ready",()=>{
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
        (e:IpcMainInvokeEvent,paths:string[]):string[]=>{
            const dirsOnly:string[]=_.filter(paths,(aPath:string):boolean=>{
                return statSync(aPath).isDirectory();
            });

            return dirsOnly;
        }
    );

    // create a new session, add to storage
    ipcMain.handle("new-session",
        (e:IpcMainInvokeEvent,folders:string[],title:string)=>{
            const session:RandomisationSession=createSession(folders,title);

            addSession(session);
        },
    );

    // get the sessions from storage
    ipcMain.handle("get-sessions",():RandomisationSession[]=>{
        return getSessions();
    });
}

main();
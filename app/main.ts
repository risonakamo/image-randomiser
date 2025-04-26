import {app,BrowserWindow,ipcMain,IpcMainInvokeEvent,screen} from "electron";
import {join} from "path";

import {createSession} from "./lib/randomisation";
import {runWithProgram} from "./lib/launch";

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
                preload:join(__dirname,"bridge.js"),
            }
        });

        window.loadFile("image-randomiser-web/build/session-viewer.html");
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
}

main();
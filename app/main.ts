import {app,BrowserWindow,screen} from "electron";
import {join} from "path";

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

        window.loadFile("test.html");
    });
}

main();
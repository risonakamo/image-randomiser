// funcs dealing with program launch

import {execa,Options} from "execa";
import _ from "lodash";
import {dirname} from "path";

/** set of launchable programs */
export const Programs:LaunchProgram[]=[
    {
        name:"Irfanview",
        path:"C:/Program Files/irfanView/i_view64.exe",
    },
    {
        name:"Chrome",
        path:"chrome",
    },
    {
        name:"CSP",
        path:"C:/Program Files/CELSYS/CLIP STUDIO 1.5/CLIP STUDIO PAINT/CLIPStudioPaint.exe",
    },
];

/** programs by name */
const ProgramsDict:LaunchProgramDict=_.keyBy(Programs,(program:LaunchProgram):string=>{
    return program.name;
});

/** launch item with a program from the program dict */
export function runWithProgram(item:string,programName:string):void
{
    if (!(programName in ProgramsDict))
    {
        console.error("failed to find program in programs dict:",programName);
        console.error(ProgramsDict);
        throw "failed to find program";
    }

    console.log("launching",ProgramsDict[programName].path);

    try
    {
        execa(ProgramsDict[programName].path,[item],{
            detached:true,
            stdio:"ignore",
            windowsHide:false,
        } satisfies Options);
    }

    catch (err)
    {
        console.error(err);
    }
}

/** launch explorer to open the parent folder of the target item */
export function openFileExplorerTo(item:string):void
{
    try
    {
        execa("explorer",[dirname(item)],{
            detached:true,
            stdio:"ignore",
            windowsHide:false,
        } satisfies Options);
    }

    catch (err)
    {
        console.error(err);
    }
}
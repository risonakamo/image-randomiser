// funcs dealing with program launch

import {execa,Options} from "execa";
import _ from "lodash";

/** set of launchable programs */
export const Programs:LaunchProgram[]=[
    {
        name:"Chrome",
        path:"chrome",
    },
    {
        name:"Irfanview",
        path:"C:/Program Files/irfanView/i_view64.exe",
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
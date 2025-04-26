// funcs dealing with program launch

import {execa,Options} from "execa";
import _ from "lodash";

/** set of launchable programs */
const Programs:LaunchProgram[]=[
    {
        name:"Chrome",
        path:"chrome",
    }
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
        throw "failed to find program";
    }

    execa(ProgramsDict[programName].path,[item],{
        detached:true,
        stdio:"ignore",
    } satisfies Options);
}
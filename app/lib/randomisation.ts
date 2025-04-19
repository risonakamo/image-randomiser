// randomisation lib funcs

import {join,dirname,basename} from "path";
import {globSync} from "glob";
import _ from "lodash";
import normalizePath from "normalize-path";
import {randomUUID} from "crypto";

/** extensions to find as randomable items */
const RandomableFileExtensions:string[]=[
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
];

/** string version for glob */
const RandomableFileExtensionsStr:string=RandomableFileExtensions.join(",");

/** given a filepath folder, find all randomable items under that
 *  folder */
export function findRandomableItems(targetPath:string):RandomItem[]
{
    const foundItems:string[]=globSync(
        normalizePath(join(targetPath,`**/*.{${RandomableFileExtensionsStr}}`))
    );

    return _.map(foundItems,(item:string):RandomItem=>{
        return {
            path:item,
            parent:dirname(item),
        };
    });
}

/** create session from target folder paths */
export function createSession(folders:string[],title:string):RandomisationSession
{
    const items:RandomItem[]=_.flatMap(folders,(folder:string):RandomItem[]=>{
        return findRandomableItems(folder);
    });

    const dirItems:RandomableFolder[]=_.map(folders,(folder:string):RandomableFolder=>{
        return {
            title:basename(folder),
            path:folder,
        }
    });

    const now:number=new Date().getTime();

    return {
        id:randomUUID().slice(0,15),
        title,

        position:0,
        createdDate:now,
        lastUpdateDate:now,

        originDirs:dirItems,
        items:_.shuffle(items),
    };
}
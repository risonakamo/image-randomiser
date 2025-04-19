// randomisation lib funcs

import {join,dirname} from "path";
import {globSync} from "glob";
import _ from "lodash";
import normalizePath from "normalize-path";

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
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
        };
    });
}

/** create session from target folder paths */
export function createSession(folders:string[],title:string|null):RandomisationSession
{
    var items:RandomItem[]=[];

    const dirItems:RandomableFolder[]=_.map(folders,(folder:string):RandomableFolder=>{
        const itemsForDir:RandomItem[]=findRandomableItems(folder);

        items=_.concat(items,itemsForDir);

        return {
            title:basename(folder),
            path:folder,
            itemsCount:itemsForDir.length,
        };
    });

    if (!title)
    {
        title=generateSessionName(dirItems);
    }

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

/** generate a name for a set of randomable folders. currently does nothing about duplicates
 *  because might want to know if have 2 of something. but if starts to happen often, should
 *  do something about that */
function generateSessionName(folders:RandomableFolder[]):string
{
    return _(folders)
        .map((folder:RandomableFolder):string=>{
            return folder.title;
        })
        .uniq()
        .join(", ");
}

/** duplicate randomisation session with new title. all items are re-randomised
 *  and read from the origin dirs, so might have different items */
export function duplicateSession(
    session:RandomisationSession,
    title:string,
):RandomisationSession
{
    return createSession(
        _.map(session.originDirs,(dir:RandomableFolder):string=>{
            return dir.path;
        }),
        title,
    );
}

/** given list of folders, get the number of items if were to make a session from
 *  those folders */
export function getItemCount(folders:string[]):ItemCounts
{
    const counts:ItemCountsDict={};
    var total:number=0;

    for (var folderI=0;folderI<folders.length;folderI++)
    {
        const folder:string=folders[folderI];

        const itemsAmount:number=findRandomableItems(folder).length;

        counts[folder]=itemsAmount;
        total+=itemsAmount;
    }

    return {
        individualCounts:counts,
        total,
    };
}
// types dealing with randomisation

/** individual counts of folders in item counts result
 *  key: path of folder
 *  val: items in that folder */
type ItemCountsDict=Record<string,number>

/** random session */
interface RandomisationSession
{
    id:string
    title:string

    // all items before this are consumed, on and
    // after are NOT consumed
    position:number

    createdDate:number
    lastUpdateDate:number

    originDirs:RandomableFolder[]
    items:RandomItem[]
}

/** a target folder that contains randomable items */
interface RandomableFolder
{
    // name of the folder
    title:string

    // filepath of the folder. also works as unique id
    path:string

    itemsCount:number
}

/** a randomable item */
interface RandomItem
{
    // filepath to the item. also a unique id
    path:string

    // parent folder
    parent:string
}

/** result of items count */
interface ItemCounts
{
    individualCounts:ItemCountsDict
    total:number
}
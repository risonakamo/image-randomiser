/** mapping of remembered folders. key is the path of the folder. each folder path
 *  can only be remembered once */
type RememberedFoldersDict=Record<string,RememberedFolder>

interface ImageRandomiserStore
{
    sessions:RandomisationSession[]

    // list of remembered folders. sorted by last use date
    rememberedFolders:RememberedFoldersDict
}

/** a folder once used in randomisation. adds additional tracking info fields */
interface RememberedFolder extends RandomableFolder
{
    timesUsed:number
    lastUseDate:number
}
/** mapping of remembered folders. key is the path of the folder. each folder path
 *  can only be remembered once */
type RememberedFoldersDict=Record<string,RememberedFolder>

/** 1st store which can get large due to sessions */
interface ImageRandomiserStore
{
    sessions:RandomisationSession[]
}

/** 2nd store for things things other than sessions */
interface ImageRandomiserStore2
{
    // list of remembered folders. sorted by last use date
    rememberedFolders:RememberedFoldersDict
}

/** a folder once used in randomisation. adds additional tracking info fields */
interface RememberedFolder extends RandomableFolder
{
    timesUsed:number
    lastUseDate:number
}
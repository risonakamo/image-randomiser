/** api available to frontend */
interface Bridge
{
    getTestSession():Promise<RandomisationSession>
    launchItem(item:string,program:string):Promise<void>
    getPrograms():Promise<string[]>
    absPathDirs(files:File[]):Promise<string[]>
}
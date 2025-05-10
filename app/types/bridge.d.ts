/** api available to frontend */
interface Bridge
{
    getTestSession():Promise<RandomisationSession>
    launchItem(item:string,program:string):Promise<void>
    getPrograms():Promise<string[]>
    absPathDirs(files:File[]):Promise<string[]>
    newSession(folders:string[],title:string):Promise<void>
    getSessions():Promise<RandomisationSession[]>
    deleteSession(deleteId:string):Promise<RandomisationSession[]>
    duplicateSession(duplicateId:string,title:string):Promise<RandomisationSession[]>
    getItemCount(folders:string[]):Promise<number>
}
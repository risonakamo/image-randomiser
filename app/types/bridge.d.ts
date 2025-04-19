/** api available to frontend */
interface Bridge
{
    getTestSession():Promise<RandomisationSession>
}
/** launch programs keyed by their name */
type LaunchProgramDict=Record<string,LaunchProgram>

/** configuration for a launchable program */
interface LaunchProgram
{
    name:string
    path:string
}
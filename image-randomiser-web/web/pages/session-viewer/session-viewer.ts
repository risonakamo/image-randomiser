import {mount} from "svelte";
import SessionViewer from "./session-viewer.svelte";

function main():void
{
    mount(SessionViewer,{target:document.body});
}

window.onload=main;
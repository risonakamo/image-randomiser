import {test} from "vitest";

import {createSession, findRandomableItems} from "@/lib/randomisation";

test("find items",()=>{
    const result=findRandomableItems("C:/Users/ktkm/Desktop/draw/ref/imgs");
    console.log(result);
    console.log(result.length);
});

test("create session",()=>{
    const session=createSession(
        [
            "C:/Users/ktkm/Desktop/draw/ref/imgs",
            "C:/Users/ktkm/Desktop/h/cg",
        ],
        "thing",
    );

    console.log(session);
});
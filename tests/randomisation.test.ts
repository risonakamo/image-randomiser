import {test} from "vitest";

import {findRandomableItems} from "@/lib/randomisation";

test("find items",()=>{
    const result=findRandomableItems("C:/Users/ktkm/Desktop/draw/ref/imgs");
    console.log(result);
    console.log(result.length);
});
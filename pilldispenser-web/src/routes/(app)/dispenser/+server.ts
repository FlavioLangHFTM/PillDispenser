import { writeDispenser } from "$lib/db/pillDispenserService";
import type { PillDispenser } from "$lib/types/types";

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
    let res = await request.json(); 
    let dispenser: PillDispenser = res as PillDispenser;
    console.log(res)

    let result = await writeDispenser(dispenser);
    
    return new Response("OK");
}
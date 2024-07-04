import { RPi_URL } from "$lib/GLOBALS.js";
import { json } from "@sveltejs/kit";
import { get } from "http";
import { produce } from "sveltekit-sse";

let lastQuittieren: Date | null = null;

export async function POST({ params, request }) {

    console.log("Pille quittiert!")

    lastQuittieren = new Date();

    return json({message: "OK"}, {status: 200});
}

export async function GET() {
    if (lastQuittieren) {
        return json({lastQuittieren: lastQuittieren.toLocaleString()}, {status: 200})
    }
    return json({message: "Noch nicht Quittiert"}, {status: 400})
}
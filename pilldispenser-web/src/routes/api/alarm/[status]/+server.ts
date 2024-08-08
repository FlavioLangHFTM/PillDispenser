import { RPi_URL } from "$lib/GLOBALS.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, request }) {

    let status: boolean = false;

    if (params.status.toLowerCase() === "true") {
        status = true;
    } else if (params.status.toLowerCase() === "false") {
        status = false;
    } else {
        return json({ message: `[ALARM] Ungltiger Parameter ${params.status}` }, { status: 400 });
    }

    try {
        console.log(RPi_URL)
        let response = await fetch(RPi_URL + "/alarm/"+status);
        console.log(response.status);
        if (response.status !== 200) {
            throw new Error;
        }

        if (status) {
            return json({ message: "[ALARM] Alarm wurde eingeschaltet!" }, { status: 200 });

        } else {
            return json({ message: "[ALARM] Alarm wurde ausgeschaltet!" }, { status: 200 });

        }
    } catch (error) {
        return json({ message: `[ALARM] Fehler beim Abrufen des PillDispenser!` }, { status: 400 });
    }
}
import { RPi_URL } from "$lib/GLOBALS.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, request }) {

    let status: boolean = false;

    if (params.status.toLowerCase() === "true") {
        status = true;
    } else if (params.status.toLowerCase() === "false") {
        status = false;
    } else {
        return json({ message: `[PILLALLOWED] Ungltiger Parameter ${params.status}` }, { status: 400 });
    }

    try {

        const response = await fetch(RPi_URL);
        if (response.status !== 200) {
            throw new Error;
        }

        if (status) {
            return json({ message: "[PILLALLOWED] Pillenausgabe erlaubt!" }, { status: 200 });

        } else {
            return json({ message: "[PILLALLOWED] Pillenausgabe nicht erlaubt!" }, { status: 200 });

        }
    } catch (error) {
        return json({ message: `[PILLALLOWED] Fehler beim Abrufen des PillDispenser!` }, { status: 400 });
    }
}
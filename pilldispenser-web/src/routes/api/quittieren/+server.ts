import { json } from "@sveltejs/kit";

let lastQuittieren: Date | null = null;

export async function POST({ }) {

    console.log("Pille quittiert!")

    lastQuittieren = new Date();

    return json({ message: "OK" }, { status: 200 });
}

export async function GET() {
    if (lastQuittieren) {
        return json({ lastQuittieren: lastQuittieren.toLocaleString() }, { status: 200 })
    }
    return json({ message: "Noch nicht Quittiert" }, { status: 400 })
}
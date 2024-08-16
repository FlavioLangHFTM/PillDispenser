import { getDispenser, writeDispenser } from "$lib/db/pillDispenserService";

export async function GET() {
    let dispenser = await getDispenser();
    dispenser.intakeLog.push({
        intakeGranted: true,
        date: new Date(),
        message: "Pille eingenommen!"
    })

    await writeDispenser(dispenser);

    return new Response("Success", { status: 200})
}
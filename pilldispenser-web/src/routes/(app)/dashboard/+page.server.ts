import { getDispenser } from '$lib/db/pillDispenserService.js'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {

    return {
        dispenser: await getDispenser()
    }
}
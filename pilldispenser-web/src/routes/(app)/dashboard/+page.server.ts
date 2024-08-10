import { getDispensers } from '$lib/db/pillDispenserService.js'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {

    return {
        dispensers: await getDispensers()
    }
}
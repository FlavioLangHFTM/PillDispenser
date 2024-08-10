import { getDispenser } from '$lib/db/pillDispenserService.js'

/** @type {import('./$types').PageServerLoad} */
export async function load({params}) {
    if(params.dispenserId === 'new') {
        return {
            dispenser: undefined
        }
    } else {
        return {
            dispenser: await getDispenser(+params.dispenserId)
        }
    }
}
import { getDispensers } from '$lib/db/pillDispenserService.js';
import type { PillDispenser } from '$lib/types/types';

export async function GET({ params, request }) {
    return new Response("Test", {status: 400})
    let pillDispensers = await getDispensers();
    let dispenser: PillDispenser;
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.socket.remoteAddress;
    console.log(ip);
    pillDispensers.forEach(element => {
    });
}
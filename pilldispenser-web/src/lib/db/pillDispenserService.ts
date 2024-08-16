import type { PillDispenser, JSONStorage } from "$lib/types/types";
import { promises as fs } from 'fs';

const storageFile = "storage.json";

// Helper function to read storage file
async function readStorage(): Promise<JSONStorage> {
    try {
        const data = await fs.readFile(storageFile, 'utf-8');
        return JSON.parse(data) as JSONStorage;
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return { dispensers: [] }; // Return empty array if file does not exist
        } else {
            throw error;
        }
    }
}

// Helper function to write storage file
async function writeStorage(data: JSONStorage): Promise<void> {
    await fs.writeFile(storageFile, JSON.stringify(data, null, 2), 'utf-8');
}

// Get all PillDispensers
export async function getDispensers(): Promise<PillDispenser[]> {
    const storage = await readStorage();
    return storage.dispensers;
}

// Get a single PillDispenser by id
export async function getDispenser(): Promise<PillDispenser> {
    const storage = await readStorage();
    const dispenser = storage.dispensers.find(d => d.id === 1);
    if (!dispenser) {
        throw new Error(`Dispenser with id ${1} not found`);
    }
    return dispenser;
}

export async function writeDispenser(dispenser: PillDispenser): Promise<PillDispenser> {
    const storage = await readStorage();

    if (dispenser.id === -1) {
        // Generate a new ID
        const maxId = storage.dispensers.reduce((max, d) => Math.max(max, d.id), 0);
        dispenser.id = maxId + 1;
    }

    const index = storage.dispensers.findIndex(d => d.id === dispenser.id);
    if (index >= 0) {
        storage.dispensers[index] = dispenser; // Overwrite existing dispenser
    } else {
        storage.dispensers.push(dispenser); // Add new dispenser
    }
    
    await writeStorage(storage);
    return dispenser;
}

// Delete a single PillDispenser
export async function deleteDispenser(id: number): Promise<PillDispenser> {
    const storage = await readStorage();
    const index = storage.dispensers.findIndex(d => d.id === id);
    if (index === -1) {
        throw new Error(`Dispenser with id ${id} not found`);
    }
    const [deletedDispenser] = storage.dispensers.splice(index, 1); // Remove dispenser from array
    await writeStorage(storage);
    return deletedDispenser;
}

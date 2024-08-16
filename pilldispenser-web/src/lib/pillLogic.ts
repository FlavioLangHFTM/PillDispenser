import { getDispenser } from "./db/pillDispenserService";
import { RPi_URL } from "./GLOBALS";
import { TimeRulesetType, type PillDispenser, type PillInterval } from "./types/types";

export function pillAllowed(dispenser: PillDispenser): boolean {

    if(dispenser.timeRulesetType === TimeRulesetType.FIXED) {
        return false;
    } else if(dispenser.timeRulesetType === TimeRulesetType.INTERVAL) {
        let ruleset: PillInterval = dispenser.timeRuleset as PillInterval;
        let now = new Date;
        let timeBeforeInterval = new Date();
        timeBeforeInterval.setHours(timeBeforeInterval.getHours() - ruleset.interval);
        let intakeInsideInterval: Date[] = [];

        dispenser.intakeLog.forEach(element => {
            if(element.intakeGranted && element.date >= timeBeforeInterval && element.date <= now) {
                intakeInsideInterval.push(element.date);
            }
        });

        intakeInsideInterval.sort((a, b) => a.getTime() - b.getTime());

        if(intakeInsideInterval.length === 0) {
            return true;
        }

        if(intakeInsideInterval.length < ruleset.pillsPerInterval) {
            let lastIntake = intakeInsideInterval[intakeInsideInterval.length - 1];
            lastIntake.setHours(lastIntake.getHours() + ruleset.minWaitTime);
            if(lastIntake <= now) {
                return true;
            }
        }
    }

    return false;
}

export function pillNeeded(dispenser: PillDispenser): boolean {
    if(dispenser.timeRulesetType === TimeRulesetType.FIXED) {
        return false;
    } else if(dispenser.timeRulesetType === TimeRulesetType.INTERVAL) {
        let ruleset: PillInterval = dispenser.timeRuleset as PillInterval;
        let now = new Date;
        let timeBeforeInterval = new Date();
        timeBeforeInterval.setHours(timeBeforeInterval.getHours() - ruleset.interval);
        let intakeInsideInterval: Date[] = [];

        let averageWaitTime = Math.round(ruleset.interval / ruleset.pillsPerInterval);

        dispenser.intakeLog.forEach(element => {
            if(element.intakeGranted && element.date >= timeBeforeInterval && element.date <= now) {
                intakeInsideInterval.push(element.date);
            }
        });

        intakeInsideInterval.sort((a, b) => a.getTime() - b.getTime());

        if(intakeInsideInterval.length === 0) {
            return true;
        }

        if(intakeInsideInterval.length < ruleset.pillsPerInterval) {
            let lastIntake = intakeInsideInterval[intakeInsideInterval.length - 1];
            lastIntake.setHours(lastIntake.getHours() + (ruleset.minWaitTime > averageWaitTime ? ruleset.minWaitTime : averageWaitTime));
            if(lastIntake <= now) {
                return true;
            }
        }
    }

    return false;
}

export async function runPillAllowed() {
    let dispenser = await getDispenser();
    if(pillAllowed(dispenser)) {
        let res = await fetch(RPi_URL+"/allowPill/true", {
            method: 'get'
        })

        if(res.status === 200) {
            console.log("Dispenser erlaubt Einnahme!")
        } else {
            console.log("Fehler bei Kommunikation mit Dispenser")
        }
    } else {
        let res = await fetch(RPi_URL+"/allowPill/false", {
            method: 'get'
        })

        if(res.status === 200) {
            console.log("Dispenser erlaubt Einnahme nicht!")
        } else {
            console.log("Fehler bei Kommunikation mit Dispenser")
        }
    }
}

export async function runPillNeeded() {
    let dispenser = await getDispenser();
    if(pillNeeded(dispenser)) {
        let res = await fetch(RPi_URL+"/alarm/true", {
            method: 'get'
        })

        if(res.status === 200) {
            console.log("Dispenser erlaubt Einnahme!")
        } else {
            console.log("Fehler bei Kommunikation mit Dispenser")
        }
    } else {
        let res = await fetch(RPi_URL+"/alarm/false", {
            method: 'get'
        })

        if(res.status === 200) {
            console.log("Dispenser erlaubt Einnahme nicht!")
        } else {
            console.log("Fehler bei Kommunikation mit Dispenser")
        }
    }
}
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
            if(element >= timeBeforeInterval && element <= now) {
                intakeInsideInterval.push(element);
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
            if(element >= timeBeforeInterval && element <= now) {
                intakeInsideInterval.push(element);
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
export type PillDispenser = {
    id: number;
    active: boolean;
    name: string,
    address: string,
    timeRulesetType: TimeRulesetType,
    timeRuleset: PillInterval | PillFixedTimes,
    intakeLog: Date[]
}

export type PillInterval = {
    pillsPerInterval: number,
    interval: number,
    minWaitTime: number,
}

export type PillFixedTimes = {
    times: Date[]
}

export enum TimeRulesetType {
    INTERVAL,
    FIXED
}

// This object represents the state of the application, a single object of this type needs to be saved in a json file.
export type JSONStorage = {
    dispensers: PillDispenser[]
}


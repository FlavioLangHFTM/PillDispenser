<script lang="ts">
	import { page } from '$app/stores';
	import {
		TimeRulesetType,
		type PillDispenser,
		type PillFixedTimes,
		type PillInterval
	} from '$lib/types/types';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import type { PageServerData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageServerData;
	let editing: boolean =
		($page.params.dispenserId && $page.params.dispenserId === 'new') || !data.dispenser
			? true
			: true;

	let timeRuleValue: TimeRulesetType = data.dispenser
		? data.dispenser.timeRulesetType
		: TimeRulesetType.FIXED;
	let editedDispenser: PillDispenser = data.dispenser
		? data.dispenser
		: {
				id: -1,
				active: true,
				name: '',
				address: '',
				timeRulesetType: TimeRulesetType.FIXED,
				timeRuleset: {
					times: [new Date()]
				},
				intakeLog: []
			};

    let pillsPerInterval: number = 1;
    let interval: number = 24;
    let minWaitTime: number = 0;

    let hour: number = 0;
    let minute: number = 0;
    let times: Date[] = [];

	editedDispenser.timeRulesetType = TimeRulesetType.INTERVAL;

    setValues();

    function setValues() {
        if(data.dispenser) {
            if(data.dispenser.timeRulesetType === TimeRulesetType.FIXED) {
                times = (data.dispenser.timeRuleset as PillFixedTimes).times
            } else if (data.dispenser.timeRulesetType === TimeRulesetType.INTERVAL) {
                let ruleset = data.dispenser.timeRuleset as PillInterval;
                pillsPerInterval = ruleset.pillsPerInterval;
                interval = ruleset.interval;
                minWaitTime = ruleset.minWaitTime;
    
            }
        } else {
            pillsPerInterval = 1;
            interval = 24;
            minWaitTime = 1;
            times = [];
        }
    }


	function getDates(): Date[] {
		if (editedDispenser.timeRulesetType === TimeRulesetType.FIXED) {
			return (editedDispenser.timeRuleset as PillFixedTimes).times;
		} else {
			return [];
		}
	}

    function addDate() {
        if (editedDispenser.timeRulesetType === TimeRulesetType.FIXED) {
            let date = new Date;
            date.setHours(hour);
            date.setMinutes(minute)
			times.push(date);
            times = times;
            hour = 0;
            minute = 0;
		}
    }

    function removeDate(i: number) {
        if (editedDispenser.timeRulesetType === TimeRulesetType.FIXED) {
			times.splice(i, 1);
            times = times;
            hour = 0;
            minute = 0;
		}
    }

    async function submitForm() {
        if(editedDispenser.timeRulesetType === TimeRulesetType.FIXED) {
            editedDispenser.timeRuleset = {
                times: times
            }
        } else if (editedDispenser.timeRulesetType === TimeRulesetType.INTERVAL) {
            editedDispenser.timeRuleset = {
                pillsPerInterval: pillsPerInterval,
                interval: interval,
                minWaitTime: minWaitTime
            }
        }

        const res = await fetch('/dispenser', {
            method: 'post',
            body: JSON.stringify(editedDispenser)
        });
        if(res.status === 200) {
            goto("/dashboard");
        }
    }

    function abort() {
        goto("/dashboard");
    }

    let formValid: boolean = true;

    $: formValid = (editedDispenser.name.length >= 1 && editedDispenser.address.length >= 10);
</script>

<div
	class="m-auto xl:w-1/2 h-full p-16 my-8 variant-glass-primary shadow flex flex-col gap-2 items-center"
>
	{#if editing}
		<span class="h3 text-center w-full"
			>{data.dispenser ? 'Dispenser bearbeiten' : 'Dispenser erfassen'}</span
		>
		<form class="flex flex-col gap-4 xl:w-2/3">
			<input id="id" type="hidden" bind:value={editedDispenser.id} />
			<!-- <input id="tileRulesetType" type="hidden" bind:value={timeRuleValue}> -->
			<label class="label hidden">
				<span>Bezeichnung</span>
				<input id="name" class="input" type="hidden" bind:value={editedDispenser.name} />
			</label>
			<label class="label">
				<span>Adresse</span>
				<input id="address" class="input" type="text" bind:value={editedDispenser.address} />
			</label>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="label">
				<span>Regeln zur Einnahme</span>
				<RadioGroup display="hidden">
					<RadioItem
						bind:group={editedDispenser.timeRulesetType}
						value={TimeRulesetType.FIXED}
						name="justify">Genaue Zeiten</RadioItem
					>
					<RadioItem
						bind:group={editedDispenser.timeRulesetType}
						value={TimeRulesetType.INTERVAL}
						name="justify">Interval</RadioItem
					>
				</RadioGroup>
			</label>
			<div class="card p-4 flex flex-col gap-4">
				{#if editedDispenser.timeRulesetType === TimeRulesetType.FIXED}
					<!-- <pre>{JSON.stringify(editedDispenser.timeRuleset, null, 2)}</pre> -->
					{#each times as time, i}
						<div class="variant-glass-primary p-2 rounded flex flex-row items-center">
							{('0' + time.getHours()).slice(-2)}:{('0' + time.getMinutes()).slice(-2)}
                            <button class="btn ml-auto" on:click={() => removeDate(i)}>Löschen</button>
						</div>
					{/each}
					<div class="card flex flex-row items-center gap-2 px-2">
						<span>Uhrzeit: </span>
						<div class="mr-auto">
							<input
								class="input w-16 rounded-md py-0 pr-0"
								placeholder="12"
								type="number"
								min="0"
								max="23"
                                bind:value={hour}
							/>
							<span>:</span>
							<input
								class="input w-16 rounded-md py-0 pr-0"
								placeholder="00"
								type="number"
								min="0"
								max="59"
                                bind:value={minute}
							/>
						</div>
						<button class="btn" on:click={() => addDate()}>Hinzufügen</button>
					</div>
				{:else if editedDispenser.timeRulesetType === TimeRulesetType.INTERVAL}
					<!-- <pre>{JSON.stringify(editedDispenser.timeRuleset, null, 2)}</pre> -->
                        <div class="mr-auto">
                            <input
                            class="input w-16 rounded-md py-0 pr-0"
                            placeholder="1"
                            type="number"
                            min="1"
                            bind:value={pillsPerInterval}
							/>
                            <span>Pillen alle</span>
							<input
                            class="input w-16 rounded-md py-0 pr-0"
                            placeholder="12"
                            type="number"
                            min="1"
                            bind:value={interval}
							/>
							<span>Stunden mit</span>
                            <input
                            class="input w-16 rounded-md py-0 pr-0"
                            placeholder="4"
                            type="number"
                            min="1"
                            bind:value={minWaitTime}
							/>
                            <span>Stunden Wartezeit</span>
						</div>
				{/if}
			</div>
            <div class="flex flex-row justify-around">
                <button disabled={!formValid} type="button" class="btn w-1/3 variant-ghost-success" on:click={() => submitForm()}>Speichern</button>
                <button type="button" class="btn w-1/3 variant-ghost-error" on:click={() => abort()}>Abbrechen</button>
            </div>
		</form>
	{:else}
		<div class="flex flex-col">
			<span>{data.dispenser?.name}</span>
		</div>
	{/if}
</div>

<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<div class="xl:w-1/2 class h-full mx-auto flex flex-col gap-4 p-2">
	<span class="h2 text-center">Letzte Einnahmen</span>
	{#each data.dispenser.intakeLog as intake}
		<div class="card min-h-16 flex flex-row items-center p-4">
			<!-- <span class="h4">{data.dispenser.name}</span>
			<button class="btn ml-auto" on:click={() => goto('/dispenser/' + dispenser.id)}
				>Bearbeiten</button
			> -->
		</div>
	{/each}

    {#if data.dispenser.intakeLog.length <= 0} 
        <span class="text-center">Keine Einnahmen vorhanden...</span>
    {/if}
	<button class="btn variant-glass-primary mt-auto" on:click={() => goto('/dispenser/1')}
		>Dosierung Bearbeiten</button
	>
</div>

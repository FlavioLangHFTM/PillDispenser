<script lang="ts">
	import { goto } from "$app/navigation";
	import type { PageServerData } from "./$types";

	export let data: PageServerData;
</script>

<div class="xl:w-1/2 class h-full mx-auto flex flex-col gap-4 p-2">
    <span class="h2 text-center">Dispensers</span>
    {#each data.dispensers as dispenser}
        <div class="card min-h-20 flex flex-row items-center p-4">
            <span class="h4">{dispenser.name}</span>
            <button class="btn ml-auto" on:click={() => goto("/dispenser/" + dispenser.id )}>Bearbeiten</button>
        </div>
    {/each}
    <button class="btn variant-glass-primary" on:click={() => goto("/dispenser/new")}>Hinzufügen</button>
</div>

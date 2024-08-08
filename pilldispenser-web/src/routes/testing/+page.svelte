<script lang="ts">
	import { SlideToggle } from "@skeletonlabs/skeleton";

	let alarmSliderValue: boolean = false;
	let pillAllowedSliderValue: boolean = false;
	let logText: string = "";
	let lastQuittieren: string = "";


	async function pollQuittieren() {
		console.log("Polling");
		const response = await fetch('/api/quittieren');
		if(response.status === 200) {
			console.log("Recieved");
			const message = await response.json();
			if (lastQuittieren !== message.lastQuittieren) {
				lastQuittieren = message.lastQuittieren;
				logText += "[QUITTIEREN] Quittiert um " + lastQuittieren + "\n";
			}
		}

		setTimeout(pollQuittieren, 3000);
	}

	async function setAlarm() {
		try {
			const response = await fetch('/api/alarm/'+alarmSliderValue);
			const message = await response.json();
			logText += message.message + " " + "\n";
		} catch (error) {
			logText += "[ALARM] Fehler beim Abrufen des Servers!"
		}
	}

	async function setPillAllowed() {
		try {
			const response = await fetch('/api/pillAllowed/'+pillAllowedSliderValue);
			const message = await response.json();
			logText += message.message + " " + "\n";
		} catch (error) {
			logText += "[PILLALLOWED] Fehler beim Abrufen des Servers!"
		}
	}

	async function testQuittieren() {
		try {
			const response = await fetch('/api/quittieren', { method: "POST"});
		} catch (error) {
			// logText += "[ALARM] Fehler beim Abrufen des Servers!"
			console.log("Error")
		}
	}

	pollQuittieren();

</script>

<div class="container h-full mx-auto w-full flex justify-center items-stretch p-2">
	<div class="space-y-5 w-full text-center flex flex-col items-center justify-start">
		<h2 class="h2">RPi Integration Test</h2>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="flex flex-col gap-2">
			<span class="h3">Alarm:</span>
			<SlideToggle name="alarmSlider" active="bg-primary-500" bind:checked={alarmSliderValue} on:change={() => setAlarm()}/>
		</label>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="flex flex-col gap-2 items-center">
			<span class="h3">Pillenausgabe erlaubt:</span>
			<SlideToggle name="pillAllowedSlider" active="bg-primary-500" bind:checked={pillAllowedSliderValue} on:change={() => setPillAllowed()}/>
		</label>
		<div class="textarea xl:w-1/2 w-full min-h-16 whitespace-pre">{logText}</div>
		<button class="btn variant-filled" on:click={() => logText = ""}>Löschen</button>
		<button class="btn variant-filled" on:click={() => testQuittieren()}>Quittieren</button>
	</div>
</div>

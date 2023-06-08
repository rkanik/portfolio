<div {...$$props}>
	<slot />
	{#if $$slots.activator}
		<slot name="activator" />
	{/if}
</div>

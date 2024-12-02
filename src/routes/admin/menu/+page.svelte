<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from 'paneforge'
</script>

<PaneGroup direction="horizontal">
	<Pane class="bg-red-500 w-72">Pane 1</Pane>
	<PaneResizer class="w-4 h-full bg-green-50" />
	<Pane defaultSize={50}>Pane 2</Pane>
</PaneGroup>

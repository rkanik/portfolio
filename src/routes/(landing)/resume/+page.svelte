<script lang="ts">
	import PdfViewer from '$lib/svelte-pdfjs/src/PDFViewer.svelte'
	import src from '$lib/utils/src'
</script>

<svelte:head>
	<title>Resume | Rasel Khandkar</title>
</svelte:head>

<div class="container min-h-screen mx-auto">
	<PdfViewer src={src('users/d91e7069-95a2-430b-8d18-aa423866315c/resume.pdf')} />
</div>

<script lang="ts">
	import src from '$lib/utils/src'
	import PdfViewer from '$lib/components/PDFViewer.svelte'
	import { PUBLIC_USER_ID } from '$env/static/public'
</script>

<svelte:head>
	<title>Resume | Rasel Khandkar</title>
</svelte:head>

<div class="container min-h-screen mx-auto">
	<!-- <PdfViewer src="/pdf/sample.pdf" /> -->
	<!-- <PdfViewer src={src('users/d91e7069-95a2-430b-8d18-aa423866315c/50-page-sample-PDF.indd.pdf')} /> -->
	<PdfViewer src={src(`users/${PUBLIC_USER_ID}/Resume of Md. Rasel Khandkar.pdf`)} />
</div>

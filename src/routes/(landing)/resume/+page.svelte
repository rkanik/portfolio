<script lang="ts">
	import src from '$lib/utils/src'
	import PdfViewer from '$lib/components/PDFViewer.svelte'
	import { getPublicUrl } from '$lib/utils/getPublicUrl.js'

	export let data
	console.log(
		data.publicUser.profile?.resume.attachment,
		getPublicUrl(data.publicUser.profile?.resume.attachment)
	)
</script>

<svelte:head>
	<title>Resume | Rasel Khandkar</title>
</svelte:head>

<div class="container min-h-screen mx-auto">
	<!-- <PdfViewer src="/pdf/sample.pdf" /> -->
	<!-- <PdfViewer src={src('users/d91e7069-95a2-430b-8d18-aa423866315c/50-page-sample-PDF.indd.pdf')} /> -->
	<PdfViewer src={getPublicUrl(data.publicUser.profile?.resume.attachment)} />
</div>
